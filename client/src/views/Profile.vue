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
                                <v-text-field prepend-icon="email" name="email" label="Email" type="email"
                                    v-model="user.email"></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryAction" @click="updateUser" v-on:keyup.enter="updateUser()"
                                :loading="loading">Update
                                Profile</v-btn>
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

    export default {
        name: 'Profile',
        data() {
            return {
                user: {
                    firstname: '',
                    lastname: '',
                    email: '',
                },
                loading: false,
            }
        },
        mounted() {
            this.getUser();
        },
        methods: {
            ...mapMutations([
                'ADD_ERROR'
            ]),
            async getUser() {
                let self = this;
                await UserService.getUser().then(result => {
                    if (result.data.message) {
                        this.ADD_ERROR(result.data)
                    } else {
                        self.user = result.data;
                    }
                })
            },
            async updateUser() {
                this.loading = true;
                let self = this;
                await UserService.updateUser(this.user).then(response => {
                    this.ADD_ERROR(response.data);
                    this.loading = false;
                })
            }
        },
    }
</script>

<style scoped>

</style>