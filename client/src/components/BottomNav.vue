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
                <!-- <v-btn color="white" flat>
                    <router-link to="/privacy" class="links">Privacy</router-link>
                </v-btn> -->
                <v-spacer></v-spacer>
                <strong class="subheading pa-3">Last Updated on {{ lastUpdated }}</strong>
            </v-card-title>
        </v-card>
    </v-footer>
</template>

<script>
    import ItemService from '@/services/ItemService'

    export default {
        name: 'BottomNav',
        data() {
            return {
                lastUpdated: ''
            }
        },
        mounted() {
            this.getLastUpdated();
        },
        methods: {
            async getLastUpdated() {
                let self = this;
                await ItemService.getLastUpdated().then(function (result) {
                    var date = new Date(result.data.updatedAt);
                    var newdate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
                    self.lastUpdated = newdate;
                })
            },
        }
    }
</script>

<style scoped>

</style>