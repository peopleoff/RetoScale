<template>
    <v-footer dark height="auto">
        <v-card class="flex" flat tile>
            <v-card-title class="pa-1">
                &copy; {{ new Date().getFullYear() }} — <strong>Retoscale.com</strong>
                <v-btn v-for="link in links" :key="link.link" color="white" flat>
                    <router-link :to="link.link" class="links">
                        {{ link.name }}
                    </router-link>
                </v-btn>
                <v-spacer></v-spacer>
                <strong class="subheading">Last Updated on {{ lastUpdated }}</strong>
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
                lastUpdated: '',
                links: [{
                        name: 'Home',
                        link: '/'
                    },
                    {
                        name: 'Login',
                        link: '/login'
                    },
                    {
                        name: 'Privacy',
                        link: '/privacy'
                    }
                ]
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