<template>
  <div class="navBar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">CS Manager</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            to="/"
            active-class="pageActive"
            exact>
            Início
          </b-nav-item>
          <b-nav-item
            to="/players"
            active-class="pageActive"
            v-if="authenticatedUser">
            Jogadores
          </b-nav-item>
          <b-nav-item
            to="/maps"
            active-class="pageActive"
            v-if="authenticatedUser">
            Mapas
          </b-nav-item>
          <b-nav-item
            to="/sweepstakes"
            active-class="pageActive"
            v-if="authenticatedUser">
            Sorteios
          </b-nav-item>
          <b-nav-item
            to="/rankings"
            active-class="pageActive"
            v-if="authenticatedUser">
            Classificação
          </b-nav-item>
          <b-nav-item
            to="/about"
            active-class="pageActive">
            Sobre
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Language" right style="display:none">
            <b-dropdown-item href="#">English</b-dropdown-item>
            <b-dropdown-item href="#">Português</b-dropdown-item>
            <b-dropdown-item href="#">Español</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right v-if="authenticatedUser">
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ displayName }}</em>
            </template>
            <b-dropdown-item to="/profile">Meu Perfil</b-dropdown-item>
            <b-dropdown-item to="#">Alterar Senha</b-dropdown-item>
            <b-dropdown-item @click="logOut">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/login" active-class="pageActive" v-else>Entrar</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    authenticatedUser() {
      return this.$store.state.user != null;
    },
    displayName() {
      return this.$store.state.user == null ? 'Usuário' : this.$store.state.user.displayName;
    },
  },
})
export default class NavBar extends Vue {
  async logOut(): Promise<void> {
    await firebase.auth().signOut();
    this.$store.commit('setGame', null);
    this.$store.commit('setUser', null);
    this.$router.push('/');
  }
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
