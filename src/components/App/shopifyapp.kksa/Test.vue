<template>
  <div>
    <h2>
      Fichier de text
    </h2>
    <mdb-container>
      <mdb-alert color="primary">
        This is a primary alert—check it out!
      </mdb-alert>
      <mdb-alert color="secondary">
        This is a secondary alert—check it out!
      </mdb-alert>
      <mdb-alert color="success">
        This is a success alert—check it out!
      </mdb-alert>
      <mdb-alert color="danger">
        This is a danger alert—check it out!
      </mdb-alert>
      <mdb-alert color="warning">
        This is a warning alert—check it out!
      </mdb-alert>
      <mdb-alert color="info">
        This is a info alert—check it out!
      </mdb-alert>
      <mdb-alert color="light">
        This is a light alert—check it out!
      </mdb-alert>
      <mdb-alert color="dark">
        This is a dark alert—check it out!
      </mdb-alert>
      <div mt-5>
        <!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
        <mdb-btn color="primary">Primary</mdb-btn>

        <!-- Default button -->
        <mdb-btn color="default">Default</mdb-btn>

        <!-- Secondary button -->
        <mdb-btn color="secondary">Secondary</mdb-btn>

        <!-- Indicates a successful or positive action -->
        <mdb-btn color="success">Success</mdb-btn>

        <!-- Contextual button for informational alert messages -->
        <mdb-btn color="info">Info</mdb-btn>

        <!-- Indicates caution should be taken with this action -->
        <mdb-btn color="warning">Warning</mdb-btn>

        <!-- Indicates a dangerous or potentially negative action -->
        <mdb-btn color="danger">Danger</mdb-btn>
      </div>
    </mdb-container>
  </div>
</template>
<script>
import { mdbContainer, mdbAlert, mdbBtn } from "mdbvue";
export default {
  name: "Test",
  components: {
    mdbContainer,
    mdbAlert,
    mdbBtn
  }
};
</script>
<!--
/siteweb/PluginsModules/stephane888/wbu-components/src/components/App/shopifyapp.kksa/Test.vue
-->
