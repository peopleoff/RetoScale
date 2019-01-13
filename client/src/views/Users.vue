<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <v-toolbar color="primary mt-5">
                    <v-toolbar-title>Edit Users</v-toolbar-title>
                    <v-divider class="mx-2" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Change {{editedItem.username}}'s Status</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-select :items="items" v-model="editedItem.status_id"></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="secondaryAction" flat @click="close">Cancel</v-btn>
                                <v-btn color="primaryAction" flat @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <v-data-table :headers="headers" :items="users" :loading="loading" class="elevation-12">
                    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                    <template slot="items" slot-scope="props">
                        <td class="text-xs-center">{{ props.item.firstname }} {{ props.item.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.username }}</td>
                        <td class="text-xs-left">{{ props.item.status_type.name }}</td>
                        <td class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="editItem(props.item)">
                                edit
                            </v-icon>
                        </td>
                    </template>
                </v-data-table>
                <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                    {{ snackText }}
                    <v-btn flat @click="snack = false">Close</v-btn>
                </v-snackbar>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import UserService from '@/services/UserService'

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    export default {
        name: 'Users',
        data() {
            return {
                search: '',
                dialog: false,
                snack: false,
                snackColor: '',
                snackText: '',
                items: ['Active', 'Pending'],
                loading: true,
                response: null,
                editedItem: {
                    id: '',
                    status_id: '',
                },
                pagination: {
                    rowsPerPage: -1
                },
                newStatus: null,
                headers: [{
                        text: 'Name',
                        align: 'center',
                        value: 'name'
                    },
                    {
                        text: 'Username',
                        align: 'left',
                        value: 'Username'
                    },
                    {
                        text: 'Status',
                        align: 'left',
                        value: 'Status'
                    },
                    {
                        text: 'Actions',
                        align: 'center',
                        value: 'actions'
                    }
                ],
                users: []
            }
        },
        mounted() {
            this.getUsers();
        },
        methods: {
            async getUsers() {
                this.loading = true;
                let self = this;
                let token = getCookie('token');
                await UserService.getUsers({
                    token: token
                }).then(result => {
                    if (result.data.error) {
                        self.snack = true;
                        self.snackColor = result.data.type;
                        self.snackText = result.data.message;
                    } else {
                        self.users = result.data;
                    }
                })
                this.loading = false;
            },
            async save() {
                let self = this;
                let token = getCookie('token');
                try {
                    if (this.editedItem.status_id == "Active") {
                        this.editedItem.status_id = 2
                    } else {
                        this.editedItem.status_id = 3
                    }
                    this.dialog = false;
                    await UserService.updateUserStatus({
                        user: this.editedItem,
                        token: token
                    }).then(function (result) {
                        self.snack = true;
                        self.snackColor = result.data.type;
                        self.snackText = result.data.message;
                    })
                } catch (error) {
                    console.log(error);
                }
                this.getUsers();
            },
            editItem(item) {
                this.editedItem.id = item.id;
                this.editedItem.username = item.username;
                this.dialog = true
            },
            cancel() {
                this.newStatus = null;
            },
            open() {},
            close() {
                this.newStatus = null;
                this.dialog = false;
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
            }
        }
    }
</script>

<style scoped>

</style>