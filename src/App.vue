<template>
<div id="app">
  <Menu mode="horizontal" :active-name="$route.path">
    <router-link to="/dashboard"><MenuItem name="/dashboard">Dashboard</MenuItem></router-link>
    <router-link to="/sprint"><MenuItem name="/sprint">Sprint</MenuItem></router-link>
    <router-link to="/config"><MenuItem name="/config">Config</MenuItem></router-link>
  </Menu>
  <transition :name="transitionName">
    <router-view></router-view>
  </transition>
  <NotificationArea></NotificationArea>
</div>
</template>

<script>
import VueRouter from 'vue-router';
import DashboardView from './components/Dashboard/index.vue';
import SprintView from './components/Sprint/index.vue';
import ConfigView from './components/Config/index.vue';
import NotificationArea from './components/NotificationArea.vue';

const router = new VueRouter({
    routes: [
        {
            path: '/dashboard',
            component: DashboardView
        },
        {
            path: '/sprint',
            component: SprintView
        },
        {
            path: '/config',
            component: ConfigView
        },
        {
            path: '*',
            redirect: 'dashboard'
        }
    ]
});

export default {
    name: 'app',
    components: {
        NotificationArea
    },
    router,
    watch: {
        '$route'(to, from) {
            const r = ['/dashboard', '/sprint', '/config'];
            this.transitionName = r.indexOf(to.path) < r.indexOf(from.path) ? 'slide--right' : 'slide--left';
        }
    },
    data () {
        return {
            transitionName: 'slide--left'
        };
    }
};
</script>

<style>
html, body, #app {
    position: relative;
    height: 100%;
    width: 100%;
}

html {
    overflow: hidden;
}

#app>.container {
    position: absolute;
    top: 60px;
    right: 0;
    bottom: 0;
    left: 0;
}

.slide--left-enter-active,
.slide--left-leave-active,
.slide--right-enter-active,
.slide--right-leave-active {
    transition: transform 0.3s;
}

.slide--left-enter-to,
.slide--left-leave,
.slide--right-enter-to,
.slide--right-leave {
    transform: translate(0, 0);
}

.slide--left-leave-to,
.slide--right-enter {
    transform: translate(-100%, 0);
}

.slide--right-leave-to,
.slide--left-enter {
    transform: translate(100%, 0);
}
</style>
