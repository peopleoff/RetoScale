<template>
    <div id="app">
        <v-app id="inspire">
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="primary">
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
                                    <v-btn color="primary" @click="updateUser" v-on:keyup.enter="updateUser()">Update
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
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import UserService from '@/services/UserService'

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
                snack: false,
                snackColor: '',
                snackText: '',
                status: null
            }
        },
        mounted() {
            this.getUser({
                token: this.$store.state.user.token
            });
        },
        methods: {
            async getUser(data) {
                this.loading = true;
                this.user = (await UserService.getUser(data)).data;
                this.loading = false;
            },
            async updateUser() {
                this.loading = true;
                let self = this;
                await UserService.updateUser(this.user).then(function (result) {
                    self.snack = true;
                    self.snackColor = result.data.type;
                    self.snackText = result.data.message;
                })
                this.loading = false;
            }
        },
    }
</script>

<style scoped>
    .scale-container {
        display: flex;
    }

    .reto-image {
        margin: 1px;
    }

    .item-name img {
        float: left;
        height: 15px;
        width: 15px;
    }
</style>