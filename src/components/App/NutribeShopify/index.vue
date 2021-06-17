<!--
Ce modele est utilisé ::http://mynutribe.kksa/shopify/?entity=app
-->
<template>
  <div>
    <!-- Menu -->
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light space-bottom-xl container-lg container"
    >
      <a class="btn btn-link d-none" href="/">
        <i class="fas fa-arrow-left"></i> Retour</a
      >
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto navbar-nav-light">
          <router-link
            class="nav-link"
            to="/manage-article"
            v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <li
              :class="[
                isActive ? 'router-link-active text-primary' : '',
                isExactActive ? 'router-link-exact-active' : '',
                'nav-link'
              ]"
            >
              <a :href="href" @click="navigate">{{ route.name }}</a>
            </li>
          </router-link>
          <router-link
            class="nav-link"
            to="/manage-blog"
            v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <li
              :class="[
                isActive ? 'router-link-active text-primary' : '',
                isExactActive ? 'router-link-exact-active' : '',
                'nav-link'
              ]"
            >
              <a :href="href" @click="navigate">{{ route.name }}</a>
            </li>
          </router-link>
          <router-link
            class="nav-link"
            to="/manage-produit"
            v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <li
              :class="[
                isActive ? 'router-link-active text-primary' : '',
                isExactActive ? 'router-link-exact-active' : '',
                'nav-link'
              ]"
            >
              <a :href="href" @click="navigate">{{ route.name }}</a>
            </li>
          </router-link>
          <router-link
            class="nav-link"
            to="/manage-order"
            v-slot="{ href, route, navigate, isActive, isExactActive }"
          >
            <li
              :class="[
                isActive ? 'router-link-active text-primary' : '',
                isExactActive ? 'router-link-exact-active' : '',
                'nav-link'
              ]"
            >
              <a :href="href" @click="navigate">{{ route.name }}</a>
            </li>
          </router-link>
        </ul>
        <div class="ml-auto">
          <localisation
            @get_user_localisation="get_user_localisation"
          ></localisation>
          <div v-if="id_admin_local">
            <span class="btn btn-outline-info btn-sm" @click="clear_cache">
              Clear cache
            </span>
          </div>
        </div>
      </div>
    </nav>
    <div class="container-lg container">
      <ajax
        :numbre_request="trigger_request"
        :data="data_post"
        :token="ajax_token"
        :debug="false"
        :show_alert_msg="true"
      ></ajax>
      <alert
        :show_alert="show_alert"
        :alert_attribut_class="class_alert"
        :alert_message="alert_message"
        @ev_alert_close="alert_close_static"
      ></alert>
      <router-view
        class="container-body space-bottom-xl"
        @ev_show_alert="ev_show_alert"
        @ev_show_alert_warning="ev_show_alert_warning"
        @ev_close_alert="ev_close_alert"
      ></router-view>
    </div>
  </div>
</template>

<script>
import "../../../plugins/bootstrap-vue.js";

import Localisation from "/siteweb/PluginsModules/stephane888/wbu-components/src/components/UserInfo/Localisation.vue";
import ajax from "./Ajax.vue";
import load_configs from "./configs.js";

const configs = load_configs;
const routes = [
  //{ path: "/gestion-categories", component: GestionCategorie },
  //{ path: "/list-categories", component: ListCategories }

  {
    name: "Article",
    path: "/manage-article",
    component: () => import("./PageArticle")
  },
  {
    name: "Blog",
    path: "/manage-blog",
    component: () => import("./PageBlog")
  },
  {
    name: "Produit",
    path: "/manage-produit",
    component: () => import("./PageProduit")
  },
  {
    name: "Order",
    path: "/manage-order",
    component: () => import("./PageOrder")
  }
];
import VueRouter from "vue-router";
const router = new VueRouter({
  routes
});

export default {
  name: "NutribeShopify",
  router,
  data: function() {
    return {
      databaseConfig: "",
      /**
       * Ajax
       */
      trigger_request: 0,
      data_post: {},
      ajax_token: "",
      /**
       * Alert
       */
      show_alert: false,
      class_alert: "alert-danger",
      alert_message: "",
      id_admin_local: false
    };
  },
  mounted() {
    this.databaseConfig = configs.databaseConfig;
  },
  components: {
    localisation: Localisation,
    ajax: ajax
  },
  methods: {
    ev_show_alert(datas) {
      this.show_alert = true;
      this.class_alert = datas.classe;
      this.alert_message = datas.title;
    },
    ev_close_alert() {
      this.show_alert = false;
      this.class_alert = "";
      this.alert_message = "";
    },
    alert_close_static() {
      this.ev_close_alert();
    },
    ev_show_alert_warning(msg) {
      var data = {
        classe: "alert-warning",
        title: msg
      };
      this.ev_show_alert(data);
    },
    get_user_localisation(data) {
      var location = JSON.parse(data);
      console.log("get_user_localisation : ", location);
      if (location.country === "CM") {
        this.id_admin_local = true;
      }
    },
    clear_cache() {
      this.data_post = {
        databaseConfig: this.databaseConfig
      };
      this.ajax_token = "shopify_delete_cache";
      this.trigger_request++;
    }
  }
};
</script>

<style lang="scss" scoped></style>

<!--
    /siteweb/PluginsModules/stephane888/wbu-components/src/components/App/NutribeShopify/index.vue
-->
