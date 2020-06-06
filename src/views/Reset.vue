<template>
    <div id="app">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12 mt-5">
                        <v-toolbar color="primary">
                            <v-toolbar-title>Change Password</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <h3>Enter your email address and we will send you a link to reset your password.</h3>
                            <v-form>
                                <v-text-field prepend-icon="lock" name="password" label="New Password" type="password"
                                    v-model="password" :error-messages="passwordErrors"></v-text-field>
                                <v-text-field prepend-icon="lock" name="confirmPassword" label="Confirm New Password"
                                    type="password" v-model="confirmPassword" :error-messages="confirmPasswordErrors"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryAction" @click="changePassword" :loading="loading">Change Password</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
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
                password: '',
                confirmPassword: '',
                loading: false
            }
        },
        methods: {
            ...mapMutations([
                'ADD_USER',
                'ADD_ERROR'
            ]),
            changePassword: function () {
                this.loading = true;
                this.$v.$touch()
                if (this.$v.$invalid) {
                    this.loading = false;
                    return
                } else {
                    UserService.changePassword({password: this.password, confirmPassword: this.confirmPassword, token: this.$route.params.token})
                        .then(response => {
                            this.ADD_ERROR(response.data);
                            this.loading = false;
                        })
                        .catch(error => {
                            this.ADD_ERROR(error);
                            this.loading = false;
                        })
                }
            },
        },
        computed:{
             passwordErrors() {
                const errors = []
                if (!this.$v.password.$dirty) {
                    return errors
                }
                if (!this.$v.password.minLength) {
                    errors.push(`Must be at least ${this.$v.password.$params.minLength.min} characters long`)
                }
                if (!this.$v.password.required) {
                    errors.push('Password is required')
                }
                return errors
            },
            confirmPasswordErrors() {
                const errors = []
                if (!this.$v.confirmPassword.$dirty) {
                    return errors
                }
                if (!this.$v.confirmPassword.$model) {
                    errors.push('Can not be empty')
                }
                if (!this.$v.confirmPassword.sameAsPassword) {
                    errors.push('Passwords must match')
                }
                return errors
            },
        },
        validations: {
            password: {
                required,
                minLength: minLength(6)
            },
            confirmPassword: {
                sameAsPassword: sameAs('password')
            },
        }
    }
</script>

<style scoped>
    #inspire .application--wrap {
        min-height: 90vh;
    }

    h3 {
        width: 75%;
        margin: 0 auto;
        text-align: center;
        padding: 10px 0;
    }
</style>