<template>
    <v-toolbar color="primary">
        <v-toolbar-title class="headline">
            <router-link to="/" class="headline"><span>RetoScale</span></router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat to="/">
            <v-avatar size="16px" class="mr-2">
                <img src="img//Items/RogueSpecial.png">
            </v-avatar>
            <span class="mr-2 color-dark text-capitalize">Items</span>
        </v-btn>
        <v-btn flat to="/synergies">
            <v-avatar size="16px" class="mr-2">
                <img src="img/synergie.png">
            </v-avatar>
            <span class="mr-2 color-dark text-capitalize">Synergies</span>
        </v-btn>
        <v-btn flat href="https://www.youtube.com/user/Retromation" rel="noreferrer">
            <v-avatar size="16px" class="mr-2">
                <img src="img/youtube.png">
            </v-avatar>
            <span class="mr-2 color-dark text-capitalize">YouTube</span>
        </v-btn>
        <v-menu open-on-hover offset-y v-if="this.$store.state.user">
            <v-btn flat slot="activator">
                {{this.$store.state.user.username}}
                <v-icon right id="dropdown">arrow_drop_down</v-icon>
            </v-btn>
            <v-list dark>
                <v-list-tile to="/">
                    Home
                </v-list-tile>
                <v-list-tile to="/profile">
                    Profile
                </v-list-tile>
                <v-list-tile to="/users">
                    All Users
                </v-list-tile>
                <v-list-tile to="/logout" color="error">
                    Logout
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
    #dropdown {
        -webkit-transition: -webkit-transform .3s ease-in-out;
        transition: transform .3s ease-in-out;
    }

    #dropdown:active {
        transform: rotate(180deg)
    }
</style>