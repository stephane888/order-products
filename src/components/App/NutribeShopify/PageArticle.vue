<template>
  <div>
    <ajax
      :numbre_request="trigger_request"
      :data="data_post"
      :token="ajax_token"
      :debug="false"
      :show_alert_msg="show_alert_msg"
      :messages="ajax_messages"
      @ev_ajax_success="ev_ajax_success"
      @ev_ajax_error="ev_ajax_error"
    ></ajax>
    <h4>Blogs</h4>
    <div class="lists-checkbox d-flex flex-wrap mt-3 space-bottom-xl">
      <div
        class="custom-control custom-checkbox"
        v-for="(blog, index) in blogs"
        :key="index"
      >
        <input
          type="checkbox"
          class="custom-control-input"
          :class="'bg-' + blog.handle"
          :value="blog.id"
          :id="'cus585Check' + index"
          v-model="blogs_select"
        />
        <label
          class="custom-control-label"
          :for="'cus585Check' + index"
          :class="'bg-' + blog.handle"
          v-html="blog.title"
          @click="select_remove_blog(blog.id)"
        >
        </label>
      </div>
    </div>
    <!-- Tables construit avec datatables -->
    <div class="d-flex justify-content-center p-5 " v-if="table_loading">
      <h2><i class="fas fa-sync fa-spin text-warning"> </i></h2>
    </div>
    <div v-show="!table_loading">
      <table :id="table_id"></table>
    </div>
    <!-- Modal pour edition du style. -->
    <modal-slot
      :id_modal="formated_id_modal"
      :show_footer="true"
      :modal_position="''"
    >
      <template v-slot:modal_header>
        <h5 v-html="modal_title" class="modal-title"></h5>
      </template>
      <div class="d-flex justify-content-center p-5" v-if="modal_loading">
        <h2><i class="fas fa-sync fa-spin text-warning"> </i></h2>
      </div>

      <component
        v-show="!modal_loading"
        v-bind:is="template_modalbody"
        :article="article_select"
        :articles="articles"
        :blog="getBlog(article_select['blog_id'])"
        :blogs="blogs"
        :metafields="metafields"
        :form_running="form_running"
        @ev_index="ev_index"
        ref="composant"
      ></component>
    </modal-slot>
  </div>
</template>

<script>
/**
 * Jquery doit etre definie (simulation);
 */
if (window.jQuery) {
  var $ = window.jQuery;
}
/**
 * moment simulation
 */
if (window.moment) {
  var moment = window.moment;
}
import ajax from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/Ajax.vue";
import load_configs from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/configs.js";
import ModalSlot from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/Modals/ModalSlot.vue";
import ReferenceBlock from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ReferenceBlock.vue";
import TypeLivre from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/TypeLivreV2.vue";
import ArticlesLier from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ArticlesLier.vue";
import PositionImage from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/PositionImage.vue";
import ArticleVideo from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/cmpts/ArticleVideo.vue";

export default {
  name: "PageArticle",
  props: {},
  components: {
    ajax: ajax,
    "modal-slot": ModalSlot
  },
  data() {
    return {
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      show_alert_msg: false,
      ajax_messages: {
        msg: "",
        type: ""
      },
      /**
       *modal
       */
      id_modal: "action-article",
      modal_title: "",
      modal_action: "",
      template_modalbody: "",
      /**
       *
       */
      table_id: "table-datas",
      articles: [],
      article_select: {},
      metafields: [],
      blogs: [],
      form_running: false,
      modal_loading: false,
      blogs_select: [],
      datatable: {},
      composant: {},
      table_loading: false
    };
  },
  mounted() {
    this.databaseConfig = load_configs.databaseConfig;
    this.getBlocs();
  },
  methods: {
    select_remove_blog() {},
    filtrageEnfunctionIdBlog(id_blog) {
      var self = this;
      /*
      console.log(
        "articles : ",
        this.articles.length,
        "\n self.blogs_select : ",
        self.blogs_select
      );
      /**/
      //this.datatable.rows().data(this.articles);

      console.log(
        "Nombre de ligne : ",
        self.datatable.rows().data().length,
        " \n id_blog",
        id_blog
      );
      /**/
      /**
       * hide rows
       */
      /*
      self.datatable
        .rows()
        .data()
        .filter(function(value) {
          //console.log(" value : ", value);
          if (id_blog === value.blog_id) {
            console.log(
              "\n value.blog_id : ",
              value.blog_id,
              "\n value.id : ",
              value.id
            );
            this.blocks.splice(index, 1);
            this.row(value).remove();
          }
        });
      /**/
      //
      /*
      var last_array = self.datatable.rows().data();
      for (const index in last_array) {
        var article = last_array[index];
        if (article.blog_id === id_blog) {
          last_array.splice(index, 1);
        }
      }
      console.log("Last_array : ", last_array);
      self.datatable.clear();
      console.log(self.datatable.rows());
      self.datatable.row().add(last_array[0]);
      self.datatable.draw();
      /**/
    },
    getArticles() {
      this.table_loading = true;
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        blogs_ids: this.blogs_select
      };
      this.ajax_token = "shopify_load_all_articles";
      this.trigger_request++;
    },
    getBlocs() {
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_load_blogs_with_metafield";
      this.trigger_request++;
    },
    ev_ajax_success(datas) {
      console.log("ev_ajax_success : ", datas);
      switch (datas.token) {
        case "shopify_load_all_articles":
          this.articles = datas.return.articles;
          this.buildTable();
          this.table_loading = false;
          break;
        case "shopify_load_articles_metafields":
          this.modal_loading = false;
          this.metafields =
            datas.return.shopify_load_articles_metafields.metafields;
          break;
        case "save_metafields":
          this.form_running = false;
          this.close_modal();
          break;
        case "shopify_load_blogs_with_metafield":
          this.blogs = datas.return.shopify_load_blog.blogs;
          this.select_all_blogs();
          break;
      }
    },
    select_all_blogs() {
      var nombreBlog = this.blogs.length;
      if (localStorage.getItem("blogs_select")) {
        this.blogs_select = JSON.parse(localStorage.getItem("blogs_select"));
      } //
      else if (!this.blogs_select.length) {
        for (const i in this.blogs) {
          this.blogs_select.push(this.blogs[i].id);
          var ii = parseInt(i) + 1;
          if (nombreBlog === ii) {
            //this.getArticles();
          }
        }
      } else {
        //this.getArticles();
      }
    },
    ev_ajax_error() {},
    buildTable() {
      var self = this;
      if (this.datatable.rows) {
        this.datatable.destroy();
        $("#" + this.table_id).empty();
      }
      this.datatable = $("#" + this.table_id).DataTable({
        data: this.articles,
        //info: false,
        order: [[0, "desc"]],
        lengthMenu: [
          [10, 30, 60, 100],
          [10, 30, 60, 100]
        ],
        pageLength: 10,
        columns: [
          { data: "id", title: "# ID " },
          { data: "title", title: "Titre" },
          {
            data: "created_at",
            title: "Date de creation",
            render: function(data) {
              return moment(data).format("DD/MM/YYYY à HH:mm");
              //return $.fn.dataTable.render.moment(data);
            },
            className: "created-at",
            dateFormat: "MM-dd-YYYY"
          },
          {
            className: "details-control",
            orderable: false,
            data: null,
            title: "Action",
            defaultContent: `<select class=" form-control select-action">
                <option value="" selected> Aucun(e)</option>
                <option value="ref_blocks">References blocks</option>
                <option value="type_livre">Type Livre</option>
                <option value="articles_lier">Articles liés</option>
                <option value="ingredients">Ingredients</option>
                <option value="position_image">Position image</option>
                <option value="article_video">Video</option>
                </select>`
          }
        ],
        rowCallback: function(row, data) {
          //console.log("row : ", row, "\n data : ", data, "\n index", index);
          // on affiche pas les articles donc l'id du blog n'est pas present dans blogs_select
          $(row).addClass("bg-" + self.getBlogHandle(data.blog_id));
        },
        language: {
          url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/French.json"
        }
        /*
        columnDefs: [
          {
            targets: 2,
            render: $.fn.dataTable.render.moment("M")
          }
        ]
        /**/
      });
      var table = this.datatable;
      $("#" + this.table_id).addClass("light-table table");
      $("#" + this.table_id + " thead").addClass("thead-light table-header");
      /**
       * On ajoute les colonnes selectionnes en surbriallance
       */
      /*
      $("#" + this.table_id + " tbody").on("mouseenter", "td", function() {
        var colIdx = table.cell(this).index().column;

        $(table.cells().nodes()).removeClass("highlight");
        $(table.column(colIdx).nodes()).addClass("highlight");
      });
      /**/
      /**
       * On applique l'action
       */
      $("#" + this.table_id + " tbody").on(
        "click",
        "tr .select-action",
        function() {
          var action = $(this).val();
          var tr = $(this)
            .parent()
            .parent();
          if (action !== "") {
            self.article_select = table.row(tr).data();
            //console.log(self.article_select);
            self.open_modal(self.article_select, action);
          }
        }
      );
    },
    getBlogHandle(blog_id) {
      var handle = "error";
      for (const i in this.blogs) {
        if (blog_id == this.blogs[i].id) {
          handle = this.blogs[i].handle;

          break;
        }
      }
      return handle;
    },
    getBlog(blog_id) {
      var blog = [];
      for (const i in this.blogs) {
        if (blog_id == this.blogs[i].id) {
          blog = this.blogs[i];
          break;
        }
      }
      return blog;
    },
    open_modal(data, action) {
      var self = this;
      self.modal_title = data.title;
      self.modal_action = action;
      self.select_template();
      $("#" + self.formated_id_modal).modal("show");
      $("#" + self.formated_id_modal).on("shown.bs.modal", function() {
        $("#" + self.formated_id_modal).off("shown.bs.modal");
        self.loadMetafield();
      });
    },
    close_modal() {
      var self = this;
      $("#" + self.formated_id_modal).modal("hide");
    },
    loadMetafield() {
      this.modal_loading = true;
      this.show_alert_msg = false;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        id_blog: this.article_select.blog_id,
        id_article: this.article_select.id
      };
      this.ajax_token = "shopify_load_articles_metafields";
      this.trigger_request++;
    },
    saveMetaField(
      type,
      key,
      type_metafield,
      id_entity,
      value,
      id_parent = null
    ) {
      this.show_alert_msg = true;
      this.data_post = {
        databaseConfig: this.databaseConfig,
        metafields: {
          type_metafield: type_metafield,
          id_entity: id_entity,
          type: type,
          key: key,
          value: value,
          id_parent: id_parent
        }
      };
      this.ajax_token = "save_metafields";
      this.trigger_request++;
    },
    select_template() {
      switch (this.modal_action) {
        case "ref_blocks":
          this.template_modalbody = ReferenceBlock;
          break;
        case "type_livre":
          this.template_modalbody = TypeLivre;
          break;
        case "articles_lier":
          this.template_modalbody = ArticlesLier;
          break;
        case "position_image":
          this.template_modalbody = PositionImage;
          break;
        case "article_video":
          this.template_modalbody = ArticleVideo;
          break;

        default:
          this.template_modalbody = "";
          break;
      }
      this.applyConfigsComponent();
    },
    applyConfigsComponent() {
      var self = this;
      setTimeout(function() {
        self.composant = self.$refs.composant;
        switch (self.modal_action) {
          case "articles_lier":
            self.composant.set_value(self.blogs_select);
            break;
        }
      }, 150);
    },
    save_reference() {},
    add_new_block() {},
    ev_index(datas) {
      switch (datas.action) {
        case "save_metafield":
          this.form_running = true;
          this.saveMetaField(
            datas.type,
            datas.key,
            datas.type_metafield,
            datas.id_entity,
            datas.value,
            datas.id_parent
          );
          break;
        case "update_select_blog":
          this.blogs_select = datas.blogs_select;
          break;
      }
    }
  },
  computed: {
    formated_id_modal: {
      get() {
        return "model-style-" + this.id_modal;
      }
    }
  },
  watch: {
    blogs_select: {
      handler(val) {
        console.log("Blogs_select : ", val);
        localStorage.setItem("blogs_select", JSON.stringify(val));
        this.getArticles();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
.lists-checkbox {
  .custom-checkbox {
    padding-right: 20px;
    min-width: 275px;
  }
}
</style>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/PageArticle.vue
-->
