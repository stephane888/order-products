<template lang="html">
  <div>
    <!-- Menu -->
    <div class="d-flex text-center text-white mb-4">
      <div
        class="w-50 p-3 border click-pointer"
        :class="{
          'bg-secondary': current_tab != 'manage_block',
          'bg-primary': current_tab == 'manage_block'
        }"
        @click="select_curent_tabs('manage_block')"
      >
        Gerer les saveurs
        <i class="fas fa-sync fa-spin " v-if="loading_blocs"></i>
      </div>
      <div
        class="w-50 p-3 border click-pointer"
        :class="{
          'bg-secondary': current_tab != 'associate_variants',
          'bg-primary': current_tab == 'associate_variants'
        }"
        @click="select_curent_tabs('associate_variants')"
      >
        Associer les ingredients à la saveur
        <i class="fas fa-sync fa-spin " v-if="loading_association"></i>
      </div>
    </div>
    <!-- saveurs -->
    <div v-show="current_tab == 'associate_variants'">
      <!-- Template pour les bouttons groupés (menu) -->
      <menus-buttons
        :group_buttons="menus"
        @ev-menu-button="evMenuButton"
      ></menus-buttons>
      <b-form-group label="Selectionner le block d'ingredient">
        <b-form-select
          v-model="selected_option"
          :options="section_ingredientsOptions"
          @change="AddIngredient"
        ></b-form-select>
      </b-form-group>
      <div>
        <div
          v-for="(listSelectedIngredient, ii) in listSelectedIngredients"
          :key="ii"
          class="d-flex align-items-center drap-drop-box pl-3"
        >
          <div class="w-100">
            <b-form-group label="reference du block ingredient">
              <b-form-input
                v-model="listSelectedIngredient.text"
                placeholder="Nom de la serveur"
                readonly
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="pl-3">
            <b-button
              size="sm"
              class="border-0"
              variant="outline-danger"
              @click="
                DeleteAssociateIngredient(
                  listSelectedIngredient.index_saveur,
                  listSelectedIngredient.value
                )
              "
            >
              <b-icon icon="trash"></b-icon>
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <!-- saveurs -->
    <div v-show="current_tab == 'manage_block'">
      <b-form-group label="Selectionner la saveur">
        <b-form-select
          v-model="selected_option"
          :options="variantsOptions1"
          @change="AddSaveur"
        ></b-form-select>
      </b-form-group>
      <b-form>
        <div v-for="(saveur, i) in saveurs" :key="i" class="drap-drop-box pl-3">
          <div class="d-flex align-items-center">
            <div class="w-100">
              <b-form-group label="Nom de la sarveur">
                <b-form-input
                  v-model="saveur.id"
                  placeholder="Nom de la serveur"
                  readonly
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Image de la saveur"
                description="l'image doit etre un texte svg"
                class="d-none"
              >
                <b-form-textarea
                  v-model="saveur.content"
                  placeholder="votre texte svg ici"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
              </b-form-group>
              <image-shopify
                :image="saveur.image"
                @image-save="ImageSave(saveur.image, ...$event)"
                @ev-delete-file="DeleteFile(saveur.image, ...$event)"
              ></image-shopify>
            </div>
            <div class="p-3">
              <b-button
                size="sm"
                class="border-0"
                variant="outline-danger"
                @click="DeleteSaveur(i)"
              >
                <b-icon icon="trash"></b-icon>
              </b-button>
            </div>
          </div>
        </div>
      </b-form>
    </div>
    <hr />
    <div class="d-flex justify-content-between">
      <ButtonSave :running="running" @ev-click="onSubmit"></ButtonSave>
    </div>
  </div>
</template>

<script>
import MenusButtons from "../../../Menus/MenusButtonsV2.vue";
import { ButtonSave } from "wbuutilities";
import Configs from "../configs.js";
import ImageShopify from "../../../ModelBlocks/Files/ImageShopify";
function DefaultVariation() {
  return {
    id: "", //la valeur de l'option au niveau dela variante du produit option1
    content: "", // text svg
    image: {
      url: "",
      alt: "",
      ShowCover: false,
      filename: "",
      key: ""
    },
    blocks: [] // les id du blocs de la sections ingrestients.(metafields du produit)
  };
}
export default {
  name: "GestionSaveurs",
  props: {
    entity: {
      type: Object,
      required: true
    },
    typeEntity: {
      type: String,
      required: true,
      validator: function(val) {
        return val === "product" ? true : false;
      }
    }
  },
  components: {
    "menus-buttons": MenusButtons,
    ButtonSave,
    "image-shopify": ImageShopify
  },
  data() {
    const keyMetafield = "saveurs";
    return {
      loading_blocs: false,
      loading_association: false,
      current_tab: "manage_block",
      saveurs: [],
      selected_option: "",
      section_ingredients: {},
      SelectedIndredientMenu: {},
      //listSelectedIngredients: [],
      keyMetafield: keyMetafield,
      running: false
    };
  },
  mounted() {
    this.GetProductMetafield();
  },
  watch: {
    //
  },
  computed: {
    variantsOptions1() {
      var options1 = [];
      //pour eviter les doublons.
      var checkOptions1 = {};
      if (this.entity.variants) {
        for (const i in this.entity.variants) {
          const variant = this.entity.variants[i];
          if (
            !this.VariantHasSelected(variant.option1) &&
            !checkOptions1[variant.option1]
          ) {
            checkOptions1[variant.option1] = true;
            options1.push({ text: variant.option1, value: variant.option1 });
          }
        }
      }
      return options1;
    },
    menus() {
      var menus = [];
      if (this.saveurs.length) {
        for (const i in this.saveurs) {
          const saveur = this.saveurs[i];
          menus.push({ id: saveur.id, value: saveur.id });
        }
      }
      return menus;
    },
    section_ingredientsOptions() {
      var options = [];
      if (this.section_ingredients) {
        for (const i in this.section_ingredients) {
          const ingredient = this.section_ingredients[i];
          if (!this.IngredientHasSelected(i))
            options.push({ text: i + " : " + ingredient.titrefp, value: i });
        }
      }
      return options;
    },
    listSelectedIngredients() {
      var options = [];
      if (this.saveurs.length) {
        for (const i in this.saveurs) {
          const saveur = this.saveurs[i];
          if (saveur.id === this.SelectedIndredientMenu.id) {
            saveur.blocks.forEach(blockId => {
              const ingredient = this.section_ingredients[blockId];
              if (ingredient)
                options.push({
                  text: blockId + " : " + ingredient.titrefp,
                  value: blockId,
                  index_saveur: parseInt(i)
                });
            });
          }
        }
      }
      return options;
    }
  },
  methods: {
    evMenuButton(menu) {
      this.SelectedIndredientMenu = menu;
      //this.AddIngredient();
    },
    AddSaveur(option1) {
      var saveur = DefaultVariation();
      saveur.id = option1;
      this.saveurs.push(saveur);
    },
    /**
     * permet d'afficher la liste des ingredients selectionner et ajoute un block si ce dernier est definit.
     */
    AddIngredient(BlockId = null) {
      for (const i in this.saveurs) {
        const saveur = this.saveurs[i];
        if (saveur.id === this.SelectedIndredientMenu.id) {
          if (BlockId) this.saveurs[i].blocks.push(BlockId);
          /**
          this.buildListSelectedIngredients(
            this.saveurs[i].blocks,
            parseInt(i)
          );
          /**/
          return;
        }
      }
    },
    buildListSelectedIngredients(blocks, index_saveur) {
      this.listSelectedIngredients = [];
      blocks.forEach(blockId => {
        if (this.section_ingredients[blockId]) {
          const ingredient = this.section_ingredients[blockId];
          this.listSelectedIngredients.push({
            text: blockId + " : " + ingredient.titrefp,
            value: blockId,
            index_saveur: index_saveur
          });
        }
      });
    },
    select_curent_tabs(current_tab) {
      this.current_tab = current_tab;
    },
    /**
     * @return true si la valeur est deja selectionné.
     */
    IngredientHasSelected(blockId) {
      for (const i in this.saveurs) {
        const ingredient = this.saveurs[i].blocks;
        if (ingredient.includes(blockId)) {
          return true;
        }
        var ii = parseInt(i) + i;
        if (ii == this.saveurs.length) {
          return false;
        }
      }
    },
    /**
     * @return true si la valeur est deja selectionné.
     */
    VariantHasSelected(option1) {
      if (!this.saveurs.length) {
        return false;
      }
      for (const i in this.saveurs) {
        const saveur = this.saveurs[i];
        if (saveur.id === option1) {
          return true;
        }
        var ii = parseInt(i) + 1;
        if (this.saveurs.length === ii) {
          return false;
        }
      }
    },
    onSubmit() {
      this.running = true;
      Configs.SaveMetaFieldProduct(
        this.saveurs,
        this.keyMetafield,
        this.entity.id
      ).then(() => {
        this.running = false;
      });
    },
    GetProductMetafield() {
      if (this.entity.id)
        Configs.GetProductMetafield(this.entity.id).then(reponse => {
          for (const i in reponse) {
            const metafield = reponse[i];
            switch (metafield.key) {
              case "section_ingredients":
                if (metafield.value !== "") {
                  this.section_ingredients = JSON.parse(metafield.value);
                }
                break;
              case "saveurs":
                if (metafield.value !== "") {
                  this.saveurs = JSON.parse(metafield.value);
                }
                break;
            }
          }
        });
    },
    DeleteSaveur(i) {
      if (this.saveurs[i]) this.saveurs.splice(i, 1);
    },
    DeleteAssociateIngredient(i, blockId) {
      console.log("DeleteAssociateIngredient : ", i, "   ", blockId);
      if (this.saveurs[i]) {
        var ii = this.saveurs[i].blocks.indexOf(blockId);
        if (ii !== undefined) this.saveurs[i].blocks.splice(ii, 1);
      }
    },
    ImageSave(image, ev) {
      image.ShowCover = true;
      Configs.SaveImage(ev).then(reponse => {
        image.ShowCover = false;
        if (reponse && reponse.key) {
          image.key = reponse.key;
          image.url = reponse.public_url;
          image.filename = ev.name;
        }
      });
    },
    DeleteFile(image, ev) {
      image.ShowCover = true;
      Configs.DeleteFile(ev).then(reponse => {
        image.ShowCover = false;
        if (reponse) {
          image.key = "";
          image.url = "";
          image.filename = "";
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>

<!--
 //nom du fichier en pascal.
 //<template>
 - le nom des attributs en kebab-case;
 - la valeur des attributs et des variables en camelCase;
 - function en PascalCase
 //props, data
 - variable en camelCase
 //methods
 - variable en PascalCase
-->
