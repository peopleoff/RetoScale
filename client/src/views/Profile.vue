<template>
    <div id="app">
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12 mt-5">
                                <v-toolbar color="primary">
                                    <v-toolbar-title>Profile</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form>
                                        <v-text-field prepend-icon="person" name="firstname" label="First Name" type="text"
                                            v-model="user.firstname"></v-text-field>
                                        <v-text-field prepend-icon="person" name="lastname" label="Last Name" type="text"
                                            v-model="user.lastname"></v-text-field>
                                        <v-text-field prepend-icon="lock" name="password" label="Password" type="password"
                                            v-model="user.password"></v-text-field>
                                        <v-text-field prepend-icon="lock" name="confirmPassword" label="Confirm Password"
                                            type="password" v-model="user.confirmPassword"></v-text-field>
                                        <v-text-field prepend-icon="email" name="email" label="Email" type="email"
                                            v-model="user.email"></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primaryAction"  @click="updateUser" v-on:keyup.enter="updateUser()"  :loading="loading">Update
                                        Profile</v-btn>
                                </v-card-actions>
                            </v-card>
                            <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                                {{ snackText }}
                                <v-btn flat @click="snack = false">Close</v-btn>
                            </v-snackbar>
                        </v-flex>
                    </v-layout>
                </v-container>
    </div>
</template>

<script>
    import UserService from '@/services/UserService'

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    export default {
        name: 'Profile',
        data() {
            return {
                user: {
                    firstname: '',
                    lastname: '',
                    password: '',
                    confirmPassword: '',
                    status_id: 3,
                    email: '',
                    registerKey: ''
                },
                loading: false,
                snack: false,
                snackColor: '',
                snackText: '',
                status: null
            }
        },
        mounted() {
            this.getUser();
        },
        methods: {
            async getUser() {
                this.loading = true;
                let self = this;
                let token = getCookie('token');
                await UserService.getUser({
                    token: token
                }).then(result => {
                    if (result.data.error) {
                        self.snack = true;
                        self.snackColor = result.data.type;
                        self.snackText = result.data.message;
                    } else {
                        self.user = result.data;
                    }
                })
                this.loading = false;
            },
            async updateUser() {
                this.loading = true;
                let token = getCookie('token');
                let self = this;
                await UserService.updateUser({
                    user: this.user,
                    token: token
                }).then(function (result) {
                    if (result.data.error) {
                        self.snack = true;
                        self.snackColor = result.data.type;
                        self.snackText = result.data.message;
                    }else{
                        self.snack = true;
                        self.snackColor = result.data.type;
                        self.snackText = result.data.message;
                    }

                })
                this.loading = false;
            }
        },
    }
</script>

<style scoped>

</style>