<template>
  <v-container fluid>
    <v-parallax dark :src="displayImage('paralax')" alt="blue paralax image" height="200" class="my-5">
      <v-layout align-left column justify-center>
        <h1 class="display-2 mb-3">RetoScale</h1>
        <h4 class="subheading">
          A ranking of items & weapons from <a href="http://dodgeroll.com/gungeon/" target="_blank" rel="noreferrer"
            class="link">Enter The Gungeon</a> based on Retromation's opinion
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
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field type="number" max="15" step="0.5" v-model="editedItem.scale"
                          label="RetoScale Number" :error-messages="editedScaleErrors"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea v-model="editedItem.notes" label="Notes" no-resize></v-textarea>
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
          <v-data-table :headers="tableHeaders()" :items="items" :search="search" :pagination.sync="pagination"
            :loading="loading" class="elevation-15">
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
              <td class="item-name pointer" @click="openWiki(props.item)">
                <img class="thumbnails" :src="'../img//Items/'+ formatItemName(props.item.image) + '.png'"
                  :alt="props.item.name + ' Image'"> {{ props.item.name }}
              </td>
              <td class="text-xs-left">{{ props.item.type }}</td>
              <td class="text-xs-left">
                <img :src="require('../../public/img/'+props.item.tier+'_Quality_Item.png')"
                  :alt="props.item.tier + ' Tier Item'"></td>
              <td class="text-xs-left" style="padding: 5px 0;">
                <div class="scale-container" slot="activator" v-html="displayScale(props.item.scale)"></div>
                ({{props.item.scale}})
              </td>
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
  import ItemService from '@/services/ItemService'
  import {
    mapMutations
  } from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {
        search: '',
        loading: true,
        items: [],
        editedItem: {
          scale: 0,
          notes: ''
        },
        editedIndex: -1,
        dialog: false,
        pagination: {
          rowsPerPage: 25,
          sortBy: 'scale',
          descending: true
        }
      }
    },
    mounted() {
        this.getItems();
    },
    methods: {
      ...mapMutations([
        'ADD_ERROR'
      ]),
      async getItems() {
        this.items = (await ItemService.getItems()).data;
        this.loading = false;
      },
      formatItemName(itemName) {
        return itemName.replace(/ +/g, "");
      },
      displayImage(image) {
        return `img/png/${image}.png`
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
              `<img class="reto-full" src="${this.displayImage('reto-full')}" alt="${scale} on the RetoScale">`
          }
        } else {
          let integer = Math.floor(scale);

          for (let i = 0; i < integer; i++) {
            html +=
              `<img class="reto-full" src="${this.displayImage('reto-full')}" alt="${scale} on the RetoScale">`
          }
          html +=
            `<img class="reto-half" src="${this.displayImage('reto-half')}" alt="${scale} on the RetoScale">`
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
      async updateItem() {
        await ItemService.updateItem({
          item: this.editedItem
        }).then(response => {
          this.ADD_ERROR(response.data);
          this.close();
          this.getItems();
        })
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

<style>
  .scale-container {
    display: flex;
  }

  .thumbnails {
    max-height: 15px;
    max-width: 15px;
  }

  .reto-full {
    height: 28px;
    width: 28px;
    margin: 1px;
  }

  .reto-half {
    height: 28px;
    width: 14px;
    margin: 1px;
  }

  .reto-image {
    margin: 1px;
  }

  .item-name img {
    float: left;
  }

  @media only screen and (max-width: 600px) {
    .reto-full {
      height: 14px;
      width: 14px;
      margin: 1px;
    }

    .reto-half {
      height: 14px;
      width: 7px;
      margin: 1px;
    }
  }
</style>