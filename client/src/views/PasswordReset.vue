<template>
    <div id="app">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12 mt-5">
                        <v-toolbar color="primary">
                            <v-toolbar-title>Reset Password</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field prepend-icon="lock" name="password" label="Password" type="password"
                                    v-model.trim.lazy="$v.user.password.$model" :error-messages="passwordErrors"></v-text-field>
                                <v-text-field prepend-icon="lock" name="confirmPassword" label="Confirm Password" type="password"
                                    v-model.trim.lazy="$v.user.confirmPassword.$model" :error-messages="confirmPasswordErrors"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="signIn" :disabled=$v.$invalid>Reset Password</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                    {{ snackText }}
                    <v-btn flat @click="snack = false">Close</v-btn>
                </v-snackbar>
            </v-layout>
        </v-container>
    </div>
</template>


<script>
    import UserService from '@/services/UserService'
    import {
        mapMutations
    } from 'vuex'
    import {
        required,
        sameAs,
        minLength
    } from 'vuelidate/lib/validators'
    export default {
        name: 'PasswordReset',
        data() {
            return {
                token: '',
                user: {
                    password: '',
                    confirmPassword: ''
                },
                snack: false,
                snackColor: '',
                snackText: '',
                status: null
            }
        },
        methods: {
            ...mapMutations([
                'ADD_USER'
            ]),
            signIn: function () {
                this.$v.$touch()
                if (this.$v.$invalid) {
                    return
                } else {
                    UserService.signIn(this.user).then(response => {
                        if (response.data.error) {
                            this.snack = true;
                            this.snackColor = response.data.type;
                            this.snackText = response.data.message;
                        } else {
                            this.ADD_USER(response.data);
                            this.$router.push('/')
                        }
                    })
                }
            },
        },
        validations: {
            user: {
                password: {
                    minLength: minLength(4),
                    required,
                },
                confirmPassword: {
                    sameAsPassword: sameAs('password')
                }
            }
        },
        computed: {
            confirmPasswordErrors() {
                const errors = []
                if (!this.$v.user.confirmPassword.$dirty) {
                    return errors
                }
                if (!this.$v.user.confirmPassword.$model) {
                    errors.push('Can not be empty')
                }
                if (!this.$v.user.confirmPassword.sameAsPassword) {
                    errors.push('Passwords must match')
                }
                return errors
            },
            passwordErrors() {
                const errors = []
                if (!this.$v.user.password.$dirty) {
                    return errors
                }
                if (!this.$v.user.password.minLength) {
                    errors.push(`Must be at least ${this.$v.user.password.$params.minLength.min} characters long`)
                }
                if (!this.$v.user.password.required) {
                    errors.push('Password is required')
                }
                return errors
            },

        }
    }
</script>

<style scoped>
    #inspire .application--wrap {
        min-height: 90vh;
    }
</style>