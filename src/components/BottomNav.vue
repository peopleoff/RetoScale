<template>
    <v-footer dark height="auto">
        <v-card class="flex" flat tile>
            <v-card-title class="pa-1">
                <router-link to="/" class="links">
                    <v-btn color="white" flat>
                        <!-- <router-link to="/" class="links">Home</router-link> -->
                        Home
                    </v-btn>
                </router-link>
                <v-btn color="white" flat v-if="!this.$store.state.user">
                    <router-link to="/login" class="links">Login</router-link>
                </v-btn>
            </v-card-title>
        </v-card>
    </v-footer>
</template>

<script>

    export default {
        name: 'BottomNav',
        data() {
            return {
                
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>