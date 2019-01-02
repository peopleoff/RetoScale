<template>
    <div id="app">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12 mt-5">
                        <v-toolbar dark>
                            <v-toolbar-title>Login form</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field prepend-icon="person" name="username" label="Username" type="text"
                                    v-model="user.username" :error-messages="usernameErrors"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password" type="password"
                                    v-model="user.password" :error-messages="passwordErrors"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="signIn" :disabled=$v.$invalid>Login</v-btn>
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
        minLength
    } from 'vuelidate/lib/validators'
    export default {
        name: 'Login',
        data() {
            return {
                user: {
                    username: '',
                    password: ''
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
                username: {
                    minLength: minLength(4),
                    required,
                },
                password: {
                    minLength: minLength(6),
                    required,
                }
            }
        },
        computed: {
            usernameErrors() {
                const errors = []
                if (!this.$v.user.username.$dirty) {
                    return errors
                }
                if (!this.$v.user.username.minLength) {
                    errors.push(`Must be at least ${this.$v.user.username.$params.minLength.min} characters long`)
                }
                if (!this.$v.user.username.required) {
                    errors.push('Username is required')
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