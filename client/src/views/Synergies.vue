<template>
    <v-container fluid>
        <v-parallax dark src="img/paralax.png" height="200" class="my-5">
            <v-layout align-left column justify-center>
                <h1 class="display-2 mb-3">RetoScale</h1>
                <h4 class="subheading">
                    A ranking of items & weapons from <a href="http://dodgeroll.com/gungeon/" target="_blank"
                        rel="nofollow" class="link">Enter The Gungeon</a> based on Retromation's opinion
                </h4>
            </v-layout>
        </v-parallax>

        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <v-card>
                    <v-toolbar flat color="primary">
                        <v-text-field v-model="search" prepend-inner-icon="search" label="Search" single-line
                            hide-details color="#212121" class="search"></v-text-field>
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">Edit {{this.editedItem.name}}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12>
                                                <v-text-field type="number" max="15" step="0.5"
                                                    v-model="editedItem.scale" label="RetoScale Number"
                                                    :error-messages="editedScaleErrors"></v-text-field>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-textarea v-model="editedItem.notes" label="Notes" no-resize>
                                                </v-textarea>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="secondaryAction" flat @click="close">Cancel</v-btn>
                                    <v-btn color="primaryAction" flat @click="updateItem">Save</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                    <v-data-table :customer-filter="filteredItems" :headers="tableHeaders()" :items="synergies"
                        :search="search" :pagination.sync="pagination" :loading="loading" class="elevation-15">
                        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
                        <template slot="items" slot-scope="props">
                            <td class="item-name pointer">
                                <img :src="props.item.image" alt=""> {{ props.item.name }}</td>
                            <td class="text-xs-left">
                                <img class="thumbnails"
                                    :src="'../img//Items/'+ formatItemName(props.item.Item_One.image) + '.png'"
                                    :alt="props.item.Item_One.image + ' Image'">
                                <br>
                                {{ props.item.Item_One.image }}
                            </td>
                            <td class="text-xs-left">
                                <img class="thumbnails"
                                    :src="'../img//Items/'+ formatItemName(props.item.Item_Two.image) + '.png'"
                                    :alt="props.item.Item_Two.image + ' Image'">
                                <br>
                                {{ props.item.Item_Two.image }}
                            </td>
                            <td class="text-xs-left" style="padding: 5px 0;">
                                <div class="scale-container" slot="activator" v-html="displayScale(props.item.scale)">
                                </div>
                                ({{props.item.scale}})
                            </td>
                            <td class="text-xs-left">{{ props.item.description }}</td>
                            <td class="text-xs-left">{{ props.item.notes }}</td>
                            <td class="justify-center layout px-0" v-if="loggedIn()">
                                <v-icon small class="mr-2" @click="editItem(props.item)">
                                    edit
                                </v-icon>
                            </td>
                        </template>
                        <v-alert slot="no-results" :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import SynergieService from '@/services/SynergieService.js'

    export default {
        name: 'Synergies',
        data() {
            return {
                search: '',
                loading: true,
                synergies: [],
                editedItem: {
                    scale: 0,
                    notes: ''
                },
                editedIndex: -1,
                dialog: false,
                pagination: {
                    rowsPerPage: 25,
                    sortBy: 'scale',
                    descending: true,
                }
            }
        },
        mounted() {
            this.getSynergies();
        },
        methods: {
            async getSynergies() {
                this.synergies = (await SynergieService.getSynergies()).data;
                this.loading = false;
            },
            formatItemName(itemName) {
                return itemName.replace(/ +/g, "");
            },
            tableHeaders() {
                if (this.$store.state.user) {
                    return [{
                            text: 'Name',
                            align: 'center',
                            value: 'name',
                            width: '20%'
                        },
                        {
                            text: 'Item 1',
                            align: 'left',
                            value: 'item_1',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            text: 'Item 2',
                            align: 'left',
                            value: 'item_2',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            text: 'Scale',
                            align: 'center',
                            value: 'scale',
                            width: '30%'
                        },
                        {
                            text: 'Description',
                            align: 'center',
                            value: 'description',
                            width: '30%'
                        },
                        {
                            text: 'Notes',
                            align: 'left',
                            value: 'notes',
                            width: '20%'
                        },
                        {
                            text: 'Actions',
                            value: 'actions',
                            align: 'center',
                            sortable: false,
                            width: '10%'
                        }
                    ]
                } else {
                    return [{
                            text: 'Name',
                            align: 'center',
                            value: 'name',
                            width: '20%'
                        },
                        {
                            text: 'Item 1',
                            align: 'left',
                            value: 'item_1',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            text: 'Item 2',
                            align: 'left',
                            value: 'item_2',
                            sortable: false,
                            width: '10%'
                        },
                        {
                            text: 'Scale',
                            align: 'center',
                            value: 'scale',
                            width: '30%'
                        },
                        {
                            text: 'Description',
                            align: 'center',
                            value: 'description',
                            width: '30%'
                        },
                        {
                            text: 'Notes',
                            align: 'left',
                            value: 'notes',
                            width: '20%'
                        }
                    ]
                }
            },
            displayScale(scale) {
                if (scale > 15) {
                    return;
                }
                let html = '';
                //Check if number is an integer first.
                if (scale % 1 === 0) {
                    for (let i = 0; i < scale; i++) {
                        html +=
                            `<img style="margin: 1px; height: 28px; width: 28px;" src="img/reto-full.png" alt="${scale} on the RetoScale">`
                    }
                } else {
                    let integer = Math.floor(scale);
                    for (let i = 0; i < integer; i++) {
                        html +=
                            `<img style="margin: 1px; height: 28px; width: 28px;" src="img/reto-full.png" alt="${scale} on the RetoScale">`
                    }
                    html +=
                        `<img style="margin: 1px; height: 28px; width: 14px;" src="img/reto-half.png" alt="${scale} on the RetoScale">`
                }
                return html
            },
            loggedIn() {
                if (this.$store.state.user) {
                    return true
                } else {
                    return false
                }
            },
            editItem(item) {
                this.editedIndex = this.synergies.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },
            async updateItem() {
                let self = this;
                await SynergieService.updateSynergies({
                    synergie: this.editedItem
                }).then(() => {
                    self.close();
                    self.getSynergies();
                })
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
            }
        },
        computed: {
            filteredItems() {
                if (this.search.trim() === '') return this.synergies;
                return this.synergies.filter(item => {
                    return item.Item_One.name.toLowerCase().includes(this.search.toLowerCase()) || item.Item_Two
                        .name.toLowerCase().includes(this.search.toLowerCase());
                }, this.search);
            },
            editedScaleErrors() {
                const errors = []
                if (!this.editedItem.scale) {
                    errors.push('Scale must be a number')
                }
                return errors
            },
        },
    }
</script>

<style scoped>
    .scale-container {
        display: flex;
    }

    .reto-full {
        height: 28px;
        width: 28px;
        margin: 1px;
    }

    .reto-half {
        height: 14px;
        width: 14px;
        margin: 1px;
    }

    .reto-image {
        margin: 1px;
    }

    .thumbnails {
        margin-left: 1rem;
    }

    .item-name img {
        float: left;
    }
</style>