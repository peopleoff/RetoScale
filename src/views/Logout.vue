<template>
    <div id="app">
        <v-app id="inspire">
            <v-content>
                <v-container fluid fill-height>
                    <v-responsive>
                        <v-layout align-center>
                            <v-flex>
                                <h3 class="display-3">You have been logged out</h3>
                                <v-btn class="info">
                                    <router-link to="/">Go Home</router-link>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-responsive>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>


<script>
    import {
        mapMutations
    } from 'vuex'
    export default {
        name: 'Logout',
        data() {
            return {}
        },
        mounted() {
            this.signOut();
        },
        methods: {
            ...mapMutations([
                'SIGN_OUT'
            ]),
            signOut: function () {
                this.SIGN_OUT();
            },
        }
    }
</script>

<style scoped>
</style>