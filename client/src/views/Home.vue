<template>
  <v-container>
    <v-responsive>
      <v-container fill-height>
        <v-layout align-center>
          <v-flex>
            <h3 class="display-3">Welcome RetroManiacs!</h3>
            <span class="subheading">Reto-Scale is a quick and easy way to view and search different items/weapons from
              Enter The Gungeon rated by Reto himself.</span>
            <br>
            <br>
            <span class="subheading">Items are rated on a scale of 0/10 Retos <img style="height: 38px; width: 38px;"
                src="img/reto-full.png" alt="Giant Reto Picture">
            </span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-responsive>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Reto-Scale</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details color="#212121"
              class="search"></v-text-field>
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" dark flat class="mb-2 color-dark" v-if="loggedIn()">New Item</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field v-model="editedItem.name" label="Item Name"  :error-messages="editedNameErrors"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.image" label="Item Image (Url)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md2>
                        <span v-if="!editedItem.image">Image Preview</span>
                        <v-img v-bind:src="editedItem.image" alt="Image Preview"></v-img>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-select :items="tierTypes" label="Tier" v-model="editedItem.tier"></v-select>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-text-field type="number" max="15" v-model="editedItem.scale" label="Reto-Scale Number" :error-messages="editedScaleErrors"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-select :items="itemTypes" label="Item Type" v-model="editedItem.type"></v-select>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field type="text-area" v-model="editedItem.notes" label="Notes"></v-text-field>
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
          <v-data-table :headers="tableHeaders()" :items="items" :search="search" :pagination.sync="pagination"
            :loading="loading">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td class="item-name pointer" @click="openWiki(props.item)">
                <img :src="props.item.image" alt=""> {{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.type }}</td>
              <td class="text-xs-left">
                <img :src="require('../../public/img/'+props.item.tier+'_Quality_Item.png')" :alt="props.item.tier + ' Tier Item'"></td>
              <td class="text-xs-left" style="padding: 5px 0;">
                <div class="scale-container" slot="activator" v-html="displayScale(props.item.scale)"></div>
                ({{props.item.scale}})
              </td>
              <td class="text-xs-left">{{ props.item.notes }}</td>
              <td class="justify-center layout px-0" v-if="loggedIn()">
                <v-icon small class="mr-2" @click="editItem(props.item)">
                  edit
                </v-icon>
                <v-icon small @click="deleteItem(props.item)">
                  delete
                </v-icon>
              </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <v-btn flat @click="snack = false">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
  import ItemService from '@/services/ItemService'
  export default {
    name: 'Home',
    data() {
      return {
        search: '',
        loading: true,
        response: null,
        itemTypes: [
          'Weapon',
          'Passive',
          'Active'
        ],
        tierTypes: [
          'S',
          'A',
          'B',
          'C',
          'D',
          'None'
        ],
        items: [],
        editedItem: {
          name: '',
          image: '',
          description: '',
          tier: '',
          type: '',
          scale: 0,
          notes: ''
        },
        editedIndex: -1,
        dialog: false,
        pagination: {
          rowsPerPage: 25,
          sortBy: 'scale',
          descending: true,
        },
        snack: false,
        snackColor: '',
        snackText: '',
        status: null
      }
    },
    mounted() {
      this.getItems();
    },
    methods: {
      async getItems() {
        this.items = (await ItemService.getItems()).data;
        this.loading = false;
      },
      openWiki(item) {
        console.log(item.name);
        let itemName = item.name.replace(" ", "_")
        window.open(`https://enterthegungeon.gamepedia.com/${itemName}`, 'Gungeon Wiki');
      },
      tableHeaders() {
        if (this.$store.state.user) {
          return [{
              text: 'Item/Gun',
              align: 'center',
              value: 'name',
              width: '20%'
            },
            {
              text: 'Type',
              align: 'left',
              value: 'type',
              width: '10%'
            },
            {
              text: 'Tier',
              align: 'left',
              value: 'tier',
              width: '10%'
            },
            {
              text: 'Scale',
              align: 'center',
              value: 'scale',
              width: '30%'
            },
            {
              text: 'Notes',
              align: 'center',
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
              text: 'Item/Gun',
              align: 'center',
              value: 'name',
              width: '20%'
            },
            {
              text: 'Type',
              align: 'left',
              value: 'type',
              width: '10%'
            },
            {
              text: 'Tier',
              align: 'left',
              value: 'tier',
              width: '10%'
            },
            {
              text: 'Scale',
              align: 'center',
              value: 'scale',
              width: '40%'
            },
            {
              text: 'Notes',
              align: 'center',
              value: 'notes',
              width: '20%'
            },
          ]
        }
      },
      loggedIn() {
        if (this.$store.state.user) {
          return true
        } else {
          return false
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
              `<img style="margin: 1px; height: 28px; width: 28px;" src="img/reto-full.png" alt="${scale} on the Reto-Scale">`
          }
        } else {
          let integer = Math.floor(scale);
          for (let i = 0; i < integer; i++) {
            html +=
              `<img style="margin: 1px; height: 28px; width: 28px;" src="img/reto-full.png" alt="${scale} on the Reto-Scale">`
          }
          html +=
            `<img style="margin: 1px; height: 28px; width: 14px;" src="img/reto-half.png" alt="${scale} on the Reto-Scale">`
        }
        return html
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
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
      deleteItem(item) {
        let confirms = confirm('Are you sure you want to delete this item?');
        if (confirms == true) {
          try {
            ItemService.deleteItem(item).then(response => {
              this.response = response;
              this.close();
              this.getItems();
            })
          } catch (error) {
            console.log(error);
          }
        }
      },
      async save() {
        if (!this.editedItem.name || !this.editedItem.scale) {
          return
        } else {
          if (this.editedIndex > -1) {
            try {
              console.log(this.editedItem.scale.length);
              await ItemService.updateItem(this.editedItem).then(response => {
                this.response = response;
                if (!response.data.error) {
                  this.snack = true;
                  this.snackColor = response.data.type;
                  this.snackText = response.data.message;
                  this.close();
                  this.getItems();
                } else {
                  this.snack = true;
                  this.snackColor = response.data.type;
                  this.snackText = response.data.message;
                }
              })
            } catch (error) {
              console.log(error);
            }
          } else {
            try {
              await ItemService.addItem(this.editedItem).then(response => {
                this.response = response;
                if (!response.data.error) {
                  this.snack = true;
                  this.snackColor = response.data.type;
                  this.snackText = response.data.message;
                  this.close();
                  this.getItems();
                } else {
                  this.snack = true;
                  this.snackColor = response.data.type;
                  this.snackText = response.data.message;
                }
                this.close();
                this.getItems();
              })
            } catch (error) {
              console.log(error);
            }
          }
          this.close()
        }
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
      },
      editedNameErrors() {
        const errors = []
        if (!this.editedItem.name) {
          errors.push('A name is required')
        }
        return errors
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

  .item-name img {
    float: left;
  }

  .search input {
    color: #212121;
  }
</style>