<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <div>
                    <v-toolbar flat>
                        <v-toolbar-title>Edit Users</v-toolbar-title>
                        <v-divider class="mx-2" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Edit User</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-select :items="items" label="Standard" v-model="editedItem.status_id"></v-select>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                                    <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                    <v-data-table :headers="headers" :items="users" :loading="loading">
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
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import UserService from '@/services/UserService'

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
                this.users = (await UserService.getUsers()).data;
                this.loading = false;
            },
            async save() {
                let self = this;
                try {
                    if (this.editedItem.status_id == "Active") {
                        this.editedItem.status_id = 2
                    } else {
                        this.editedItem.status_id = 3
                    }
                    this.dialog = false;
                    await UserService.updateUserStatus(this.editedItem).then(function(result){
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
                this.dialog = true
            },
            cancel() {
                this.newStatus = null;
            },
            open() {},
            close() {
                this.newStatus = null;
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
            }
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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