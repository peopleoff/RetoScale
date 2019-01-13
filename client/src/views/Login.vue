<template>
    <div id="app">
        <v-container fluid fill-height>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card class="elevation-12 mt-5">
                        <v-toolbar color="primary">
                            <v-toolbar-title>Login form</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form>
                                <v-text-field prepend-icon="person" name="username" label="Username" type="text"
                                    v-model="user.username" :error-messages="usernameErrors"></v-text-field>
                                <v-text-field prepend-icon="lock" name="password" label="Password" type="password"
                                    v-model="user.password" :error-messages="passwordErrors"></v-text-field>
                                <router-link to="/PasswordReset" class="text-xs-right white--text" style="float: right;">Forgot
                                    Password?</router-link>
                                <v-checkbox color="primaryAction" v-model="rememberme" label="Remember Login?"></v-checkbox>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryAction" @click="signIn" :disabled=$v.$invalid :loading="loading">Login</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                    {{ snackText }}
                    <v-btn flat @click="snack = false">Close</v-btn>
                </v-snackbar>
            </v-layout>
        </v-container>
        <v-container fluid fill-height>
            <v-layout>
                <v-flex xs12 sm8 md4 offset-sm2 offset-md4>
                    <v-card>
                        <v-card-title class="justify-center">
                            <h3 class="text-xs-center">Need an account? <router-link to="/register" class="white--text">Register
                                    Here</router-link>
                            </h3>
                        </v-card-title>
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
                loading: false,
                rememberme: false,
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
                this.$v.$touch();
                this.loading = true;
                if (this.$v.$invalid) {
                    return
                } else {
                    UserService.signIn(this.user).then(response => {
                         this.loading = false;
                        if (response.data.error) {
                            this.snack = true;
                            this.snackColor = response.data.type;
                            this.snackText = response.data.message;
                        } else {
                            var today = new Date();
                            var expire = new Date();
                            if (this.rememberme) {
                                //If remember me is checked, create cookie token cookie for a week
                                expire.setTime(today.getTime() + 3600000 * 24 * 7);
                                document.cookie = "token=" + escape(response.data.token) + ";expires=" +
                                    expire.toGMTString();
                            } else {
                                //Otherwise set expiration for one hour
                                expire.setTime(today.getTime() + 1 * 3600 * 1000);
                                document.cookie = "token=" + escape(response.data.token) + ";expires=" +
                                    expire.toGMTString();
                            }
                            this.ADD_USER({
                                username: response.data.username
                            });
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

</style>