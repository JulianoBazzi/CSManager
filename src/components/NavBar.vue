<template>
  <div class="navBar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">CS Manager</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" active-class="pageActive" exact>Início</b-nav-item>
          <b-nav-item to="/players" active-class="pageActive">Jogadores</b-nav-item>
          <b-nav-item to="/maps" active-class="pageActive">Mapas</b-nav-item>
          <b-nav-item to="/sweepstakes" active-class="pageActive">Sorteios</b-nav-item>
          <b-nav-item to="/about" active-class="pageActive">Sobre</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Language" right style="display:none">
            <b-dropdown-item href="#">English</b-dropdown-item>
            <b-dropdown-item href="#">Português</b-dropdown-item>
            <b-dropdown-item href="#">Español</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>Usuário</em>
            </template>
            <b-dropdown-item to="#">Meu Perfil</b-dropdown-item>
            <b-dropdown-item to="#">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NavBar extends Vue {

}
</script>

<style scoped>
.navBar {
  padding-bottom: 20px;
}

.pageActive {
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

</style>
