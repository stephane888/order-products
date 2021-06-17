<!--
1 - Lorsqu'on ajoute un terme dans une categorie vide, elle ne s'affiche pas dans le tableau.
2 - Les id de termes ne sont pas dans un bon format.( il faut revoir la methode )
3 - Sur le template d'action, il faut ajouter l'action delete.
4 - Gestion des termes en doubles.( ne pas permettre la sauvergarde d'un terme en double );[[OK]]
5 - Remarque si on ajoute await devant une fonction promise, c'est le resultat qui est retournée, sinon une promesse donc on doit utiliser then pour la suite.[[OK]]
-->
<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <div class="p-4 border mb-5">
      <div class="row">
        <div class="col-md-6">
          <!-- selectionner le blog -->
          <builder-forms
            :forms="forms_blog"
            @ev_builder_forms="ev_builder_forms_blog"
            :show_submit="false"
          ></builder-forms>
        </div>
        <div class="col-md-6">
          <builder-forms
            v-if="blog_handle !== ''"
            :forms="forms"
            @ev_builder_forms="ev_builder_forms"
            :is_running="form_add_cat_is_running"
            :text_save="'Ajouter le terme'"
          ></builder-forms>
        </div>
      </div>
    </div>
    <div class="p-4 border mb-5">
      <tableau-gestion
        :show_id="true"
        :show_action="true"
        :rows="table_rows"
        :headers="table_headers"
        :empty_message="table_empty_message"
        :table_title="table_title"
        :show_title="table_show_title"
        :template_footer="table_template_footer"
        :datas_footer="table_datas_footer"
        :is_running="table_select_blog_is_running"
        :template_tableau_action="table_template_tableau_action"
        :template_edit="table_template_edit"
        :datas_ligne_edit="table_datas_ligne_edit"
        :template_edit_is_runing="table_template_edit_is_runing"
        @ev_action_ev_template_tableau_action="
          ev_action_ev_template_tableau_action
        "
        @ev_template_edit="ev_template_edit"
      ></tableau-gestion>
    </div>
  </div>
</template>

<script>
/**
 * Jquery doit etre definie;
 */
var $;
if (window.jQuery) {
  $ = window.jQuery;
} else if (window.$) {
  $ = window.$;
}
import load_configs from "../configs.js";
import ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";

/**
 * Template pour gerer l'edition des données.
 */
import TableEditDatas from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Tableau/Elements/EditRow.vue";

/**
 * Contient les bouttons pour les actions au niveau de la cellule action
 */
import TemplateTableauAction from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Tableau/Elements/TemplateTableauAction.vue";

/**
 * Template pour gerer les données vides.
 */
const table_empty_categorie = {
  name: "TableEmptyCategorie",
  props: {
    datas: {
      type: [String, Boolean, Object, Array],
      default: "Vide"
    }
  },
  template: `<div v-html="datas" class="text-center"></div>`
};

const configs = load_configs;

export default {
  name: "GestionCategorie",
  mounted() {
    //console.log(" Chargement du module : GestionCategorie.vue ");
    this.databaseConfig = configs.databaseConfig;
    this.getBlogs();
  },
  data: function() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      /**
       *table
       */
      table_rows: [],
      table_headers: {},
      table_empty_message: "Aucune categorie",
      table_show_title: false,
      table_title: "",
      table_select_blog_is_running: false,
      // Contient les buttons d'action dans la cellule action.
      table_template_tableau_action: TemplateTableauAction,
      table_datas_ligne_edit: {},
      // Contient le formulaire d'edition des données ou de toute autre actions.
      table_template_edit: "",
      table_template_edit_is_runing: false,
      /**
       * Formulaire ajout d'un terme.
       */
      forms: [
        {
          template: "input-text",
          input: {
            value: ""
          },
          label: "Nom de la categorie",
          name: "categorie",
          rules: "required"
        }
      ],
      form_add_cat_is_running: false,
      /**
       * Formulaire pour la selection du blog.
       */
      forms_blog: [],
      //
      databaseConfig: "",
      /**
       * contient le hnadle
       */
      blog_handle: "",
      /**
       * Contient tous les blogs( flux from shopify )
       */
      flux_blogs: [],
      /**
       * Contient le blog selectionne par l'utilisateur.
       * @object
       */
      blog: {},
      /**
       * Contient le flux de metafields du blog.
       */
      flux_blog_metafields: [],
      /**
       * Contient les données du metafield blog_categories
       */
      blog_category: []
    };
  },
  components: {
    ajax: ajax
  },
  computed: {
    formated_blog_handle: {
      get() {
        return this.blog_handle;
      },
      set(val) {
        this.blog_handle = val;
        this.getIdBlogByHandle(val);
      }
    },
    table_datas_footer: {
      get() {
        if (!this.table_rows.length && Object.keys(this.table_headers).length) {
          return "Aucune categorie disponible";
        } else {
          return "";
        }
      }
    },
    table_template_footer: {
      get() {
        if (!this.table_rows.length && Object.keys(this.table_headers).length) {
          return table_empty_categorie;
        } else {
          return "";
        }
      }
    }
  },
  methods: {
    ev_template_edit(datas) {
      var self = this;
      console.log("tableau ev_template_edit : ", datas);
      if (datas.action == "close") {
        this.closeTemplateEdit();
      } else if (datas.forms && datas.params) {
        this.table_template_edit_is_runing = true;
        if (datas.params.action == "save") {
          if (this.blog_category[datas.forms.index]) {
            var value = this.blog_category[datas.forms.index];
            if (value.value) {
              value.value = datas.forms.value;
            }
            this.blog_category[datas.forms.index] = value;
            this.saveMetafieldblogCategory("by_tableau");
          }
        }
        if (datas.params.action == "delete") {
          this.closeTemplateEdit();
          /**
           * Verification avant suppresion.
           */

          (async function() {
            var validation = await self.ValidBeforeDelete(datas.forms.index);
            if (validation.status) {
              self.blog_category.splice(datas.forms.index, 1);
              //self.saveMetafieldblogCategory("by_tableau");
            } else {
              self.$emit("ev_show_alert_warning", validation.msg);
            }
          })();
          /**/
        }
      }
    },
    ValidBeforeDelete(index) {
      var self = this;
      return new Promise(resolve => {
        (async function() {
          var categorie = await self.categorieIsUse(index);
          if (categorie.status) {
            resolve({ status: true });
          } else {
            resolve(categorie);
          }
        })();
      });
    },
    categorieIsUse(index) {
      var self = this;
      console.log("categorieIsUse", index, "\n\n ", self.blog_category[index]);
      return new Promise(resolve => {
        if (
          self.blog_category[index] &&
          self.blog_category[index].articles.length
        ) {
          resolve({
            status: false,
            msg: "Cette categorie est deja associée à des articles"
          });
        } else {
          resolve({ status: true });
        }
      });
    },
    closeTemplateEdit() {
      $(".setting-edit")
        .css({
          "z-index": -10,
          backgroundColor: "none",
          opacity: 0
        })
        .addClass("d-none")
        .removeClass("d-flex");
    },
    ev_action_ev_template_tableau_action(datas) {
      var self = this;
      console.log("ev_action_ev_template_tableau_action :", datas);
      /**
       * on passe directement les données
       */
      this.table_datas_ligne_edit = datas;
      /**
       * on charge un template anfunction de l'action;
       */
      if (datas.action == "edit") {
        this.table_template_edit = TableEditDatas;
      } else if (datas.action == "delete") {
        this.table_template_edit = "";
        /**
         * Verification avant suppresion.
         */

        (async function() {
          var validation = await self.ValidBeforeDelete(datas.index);
          if (validation.status) {
            //self.blog_category.splice(datas.index, 1);
            //self.saveMetafieldblogCategory("by_tableau");
          } else {
            self.$emit("ev_show_alert_warning", validation.msg);
          }
        })();
        /**/
        /**
         * suppresion direct
         */
        /**
        if (datas.index === 0 || datas.index > 0) {
          this.blog_category.splice(datas.index, 1);
          this.saveMetafieldblogCategory("by_tableau");
        }
        */
      }
    },
    getIdBlogByHandle(handle) {
      for (const i in this.flux_blogs) {
        if (this.flux_blogs[i].handle === handle) {
          this.blog = this.flux_blogs[i];
          this.getMetafieldsBlogs(this.blog.id);
          break;
        }
      }
    },
    getMetafieldsBlogs(id_blog) {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: id_blog
      };
      this.ajax_token = "shopify_load_blogs_metafields";
      this.trigger_request++;
    },
    /**
     * Ajout d'un nouveau terme dans le metafield.
     * Lorsque les données sont renvoyes, il faut tjrs effectuer une verification.
     * [ Execution sequentiel controlé ].
     */
    ev_builder_forms(datas) {
      var self = this;
      /**
       * Avant l'ajout d'un nouveau terme, on demande la fermeture de alert
       */
      this.$emit("ev_close_alert");
      if (datas.categorie && datas.categorie !== "") {
        var traitement = function() {
          (function() {
            /**
             * On precise
             */
            self.form_add_cat_is_running = true;
            /**
             * On recupere le dernier identifiant;
             */
            var id = 1;
            if (self.blog_category.length) {
              id = self.blog_category.slice(-1)[0];
              if (id.id) {
                id = id.id + 1;
              }
            }
            var metafield = {
              id: id,
              value: datas.categorie,
              articles: []
            };
            self.blog_category.push(metafield);
            self.saveMetafieldblogCategory("ev_builder_forms");
          })();
        };

        var execution = function() {
          (async function() {
            /**
             * on verifie le terme
             */
            var validation = self.validationTerm(datas.categorie);
            validation.then(function(data) {
              console.log("validation :", data);
              if (data.status) {
                /**
                 * Traitement;
                 */
                traitement();
              } else {
                // On affiche un message d'erreur.
                self.$emit("ev_show_alert_warning", data.msg);
              }
            });
          })();
        };
        execution();
      }
    },
    validationTerm(val) {
      var self = this;
      return new Promise(resolve => {
        (async function() {
          var Doublon = await self.checkDoublonTerm(val);
          if (!Doublon.status) {
            resolve({ status: false, msg: Doublon.msg });
          }
          resolve({ status: true, msg: "" });
        })();
      });
    },
    checkDoublonTerm(val) {
      var self = this;
      return new Promise((resolve, reject) => {
        if (self.blog_category.length) {
          for (const i in self.blog_category) {
            if (self.blog_category[i].value === val) {
              resolve({ status: false, msg: "Le terme existe déjà" });
            }
            var ii = parseInt(i) + 1;
            if (self.blog_category.length <= ii) {
              resolve({ status: true, msg: "" });
            }
          }
        } else {
          resolve({ status: true, msg: "" });
        }

        /**
         * La fin du code s'execute en cas d'erreur.
         * (utile en dev)
         */
        //console.log("Error checkDoublonTerm");
        reject();
      });
    },
    /**
     * Provider permet de terminer qui a déclencher l'action.
     */
    saveMetafieldblogCategory(provider = null) {
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          key: "blog_categories",
          value: this.blog_category,
          type: "blog",
          id_entity: this.blog.id,
          type_metafield: "json_string"
        },
        provider: provider
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    /**
     * Selection d'un blog.
     */
    ev_builder_forms_blog(datas) {
      //console.log("\n ev_builder_forms_blog : ", datas);
      /**
       * On verifie que le contenu n'est pas vide.
       */
      if (datas.blog_handle !== "") {
        this.table_select_blog_is_running = true;
        this.formated_blog_handle = datas.blog_handle;
      } else {
        this.blog_handle = "";
      }
      /**
       * On masque le formulaire d'edition
       */
      this.closeTemplateEdit();
    },
    getBlogs() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_load_blogs";
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      var self = this;
      console.log("ev_ajax_success : ", datas);
      /**
       * Chargement des blogs
       */
      if (
        datas.return &&
        datas.return.shopify_load_blog &&
        datas.return.shopify_load_blog.blogs
      ) {
        this.flux_blogs = datas.return.shopify_load_blog.blogs;
        this.buildLists(this.flux_blogs);
      } else if (
        /**
         * Données brute de metafields (blog)
         */
        datas.return &&
        datas.return.shopify_load_blogs_metafields &&
        datas.return.shopify_load_blogs_metafields.metafields
      ) {
        this.flux_blog_metafields =
          datas.return.shopify_load_blogs_metafields.metafields;
        /**
         * on recupere un metafield en particulier.
         */

        var reseulKeySearch = async function() {
          /**
           * ####
           * Question importante, pourquoi c'est pas un promise qui est retounée ???
           */
          /**
           * On recupere la valeur et on affiche les categories dans un tableau.
           */
          var result = await self.getMetafieldByKey("blog_categories");
          //console.log("1-result : ", result);
          self.table_select_blog_is_running = false;
          if (result.value) {
            var val = JSON.parse(result.value);
            self.blog_category = val;
            self.buildTabbleauCategories();
          } else if (result.then) {
            result.then(function(metafield) {
              var val = JSON.parse(metafield.value);
              self.blog_category = val;
              self.buildTabbleauCategories();
            });
          } else {
            self.blog_category = [];
            self.buildTabbleauCategories([]);
          }
        };
        reseulKeySearch();
      } else if (
        /**
         * Sauvegarde du metafield.
         */
        datas.return &&
        datas.return.save_metafields
      ) {
        this.form_add_cat_is_running = false;
        this.table_template_edit_is_runing = false;
        //console.log("Datas metafields : ", datas.return.save_metafields);
        if (datas.configs.provider == "by_tableau") {
          this.closeTemplateEdit();
        }
      } else {
        this.show_alert_msg = true;
        this.form_add_cat_is_running = false;
        this.table_template_edit_is_runing = false;
      }
    },
    ev_ajax_error(datas) {
      this.show_alert_msg = true;
      if (datas.token) {
        if (datas.token == "save_metafields") {
          this.form_add_cat_is_running = false;
          this.table_template_edit_is_runing = false;
        } else {
          this.form_add_cat_is_running = false;
          this.table_select_blog_is_running = false;
          this.table_template_edit_is_runing = false;
        }
      } else {
        this.form_add_cat_is_running = false;
        this.table_select_blog_is_running = false;
        this.table_template_edit_is_runing = false;
      }
    },
    async getMetafieldByKey(key_search) {
      return new Promise(resolve => {
        if (this.flux_blog_metafields.length) {
          for (const i in this.flux_blog_metafields) {
            if (this.flux_blog_metafields[i].key === key_search) {
              resolve(this.flux_blog_metafields[i]);
            } else {
              var ii = i + 1;
              //console.log(this.flux_blog_metafields.length, "\n :", ii);
              if (this.flux_blog_metafields.length <= ii) {
                resolve(false);
              }
            }
          }
        } else {
          resolve(false);
        }
      });
    },
    buildTabbleauCategories() {
      this.table_headers = {
        value: {
          name: "value",
          label: "Valeur",
          edit: {
            template: "input-text"
          }
        }
      };

      this.table_rows = this.blog_category;
      this.table_show_title = true;
      this.table_title = "Categories du blogs  ";
    },
    buildLists(rows) {
      var options = {};
      for (const i in rows) {
        options[rows[i].handle] = rows[i].title;
      }
      this.forms_blog = [
        {
          template: "input-select",
          input: {
            value: ""
          },
          label: "Selectionner le blog",
          name: "blog_handle",
          rules: "required",
          options: options,
          trigger: {
            submit: true
          }
        }
      ];
    }
  }
};
</script>
<!--
      cmpts/GestionCategorie.vue
-->
<style lang="scss">
.setting-action {
  .button {
    cursor: pointer;
  }
  .fa-edit:hover {
    color: #fb9908;
  }
}
</style>
