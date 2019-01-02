<template>
    <v-toolbar>
        <v-toolbar-title class="headline">
            <router-link to="/" class="headline color-dark"><span>Reto-Scale</span></router-link>

        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat href="https://www.youtube.com/user/Retromation" target="_blank">
            <span class="mr-2 color-dark text-capitalize">Subscribe on YouTube</span>
        </v-btn>
        <v-menu offset-y v-if="this.$store.state.user">
            <v-btn flat slot="activator">
                {{this.$store.state.user.username}}
                <v-icon dark right>arrow_drop_down</v-icon>
            </v-btn>
            <v-list dark>
                <v-list-tile>
                    <router-link to="/profile" class="links">Profile</router-link>
                </v-list-tile>
                <v-list-tile>
                    <router-link to="/users" class="links">All Users</router-link>
                </v-list-tile>
                <v-list-tile>
                    <router-link to="/logout" class="links">Sign Out</router-link>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-toolbar>
</template>

<script>
    export default {
        name: 'TopNav',
        data() {
            return {}
        },
    }
</script>

<style scoped>

</style>