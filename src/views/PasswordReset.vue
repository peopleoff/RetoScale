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
                            <h3>Enter your email address and we will send you a link to reset your password.</h3>
                            <v-form>
                                <v-text-field prepend-icon="email" name="email" label="Enter your email address"
                                    type="email" :error-messages="emailErrors" v-model="user.email"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryAction" @click="passwordReset" :loading="loading">Reset Password
                            </v-btn>
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
        email,
        minLength
    } from 'vuelidate/lib/validators'
    export default {
        name: 'PasswordReset',
        data() {
            return {
                user: {
                    email: '',
                },
                loading: false
            }
        },
        methods: {
            ...mapMutations([
                'ADD_USER',
                'ADD_ERROR'
            ]),
            passwordReset: function () {
                this.loading = true;
                this.$v.$touch();
                if (this.$v.$invalid) {
                    this.loading = false;
                    return
                } else {
                    UserService.passwordReset(this.user)
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
        validations: {
            user: {
                email: {
                    minLength: minLength(4),
                    email,
                    required,
                },
            }
        },
        computed: {
            emailErrors() {
                const errors = []
                if (!this.$v.user.email.$dirty) {
                    return errors
                }
                if (!this.$v.user.email.email) {
                    errors.push('Must be valid e-mail')
                }
                if (!this.$v.user.email.required) {
                    errors.push('E-mail is required')
                }
                return errors
            }
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