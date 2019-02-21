<template>
  <v-container>
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
                        <v-text-field v-model="editedItem.name" label="Item Name" :error-messages="editedNameErrors"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field v-model="editedItem.image" label="Item Image (Url)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md2 class="hidden-sm-and-down">
                        <span v-if="!editedItem.image">Image Preview</span>
                        <v-img v-if="editedItem.image" v-bind:src="editedItem.image" alt="Image Preview"></v-img>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-select :items="tierTypes" label="Tier" v-model="editedItem.tier"></v-select>
                      </v-flex>
                      <v-flex xs12 sm4>
                        <v-text-field type="number" max="15" step="0.5" v-model="editedItem.scale" label="RetoScale Number"
                          :error-messages="editedScaleErrors"></v-text-field>
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
                  <v-btn color="secondaryAction" flat @click="close">Cancel</v-btn>
                  <v-btn color="primaryAction" flat @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table :headers="tableHeaders()" :items="items" :search="search" :pagination.sync="pagination"
            :loading="loading" class="elevation-15">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td class="item-name pointer" @click="openWiki(props.item)">
                <img :src="'../img//Items/'+ formatItemName(props.item.name) + '.png'" alt=""> {{ props.item.name }}</td>
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


  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }


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
      formatItemName(itemName){
        return itemName.replace(/ +/g, "");
      },
      openWiki(item) {
        let itemName = item.name.replace(" ", "_")
        window.open(`https://enterthegungeon.gamepedia.com/${itemName}`, 'Gungeon Wiki');
      },
      tableHeaders() {
        if (this.$store.state.user) {
          return [{
              text: 'Item',
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
              text: 'Item',
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
              align: 'left',
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
        let token = getCookie('token');
        let confirms = confirm('Are you sure you want to delete this item?');
        if (confirms == true) {
          try {
            ItemService.deleteItem({
              item: item,
              token: token
            }).then(response => {
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
        let token = getCookie('token');
        if (!this.editedItem.name || !this.editedItem.scale) {
          return
        } else {
          if (this.editedIndex > -1) {
            try {
              await ItemService.updateItem({
                item: this.editedItem,
                token: token
              }).then(response => {
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
              await ItemService.addItem({
                item: this.editedItem,
                token: token
              }).then(response => {
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
        return this.editedIndex === -1 ? 'New Item' : `Edit ${this.editedItem.name}`
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
</style>