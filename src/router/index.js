import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const paths = [
    {
        path: '/',
        meta:{
            title:'Home'
        }
    },
    {
        path:'/login',
        meta:{
            title:'登入'
        }
    },
    {
        path:'/main',
        name:'/admin',
        meta:{
            title:'管理者'
        }
    },
    {
        path:'/agent',
        name:'/admin/account',
        meta:{
            title:'代理商管理'
        }
    },
    {
        path:'/member',
        name:'/admin/account',
        meta:{
            title:'會員管理'
        }
    },
    {
        path:'/account',
        name:'/admin/setting',
        meta:{
            title:'帳戶設定'
        }
    },
    {
        path:'/role',
        name:'/admin/setting',
        meta:{
            title:'角色設定'
        }
    },
    {
        path:'/access',
        name:'/admin/setting',
        meta:{
            title:'權限設定'
        }
    },
    {
        path:'/win_lose',
        name:'/admin/resport',
        meta:{
            title:'Win/Lose'
        }
    },
    {
        path:'/history',
        name:'/admin/resport',
        meta:{
            title:'Bet History'
        }
    },
    {
        path:'/report',
        name:'/admin/resport',
        meta:{
            title:'All Report'
        }
    },
    {
        path:'/wallet',
        name:'/admin/resport',
        meta:{
            title:'Wallet'
        }
    },
    {
        path:'/login_log',
        name:'/admin/record',
        meta:{
            title:'使用者登入log'
        }
    },
    {
        path:'/course_log',
        name:'/admin/record',
        meta:{
            title:'歷程log'
        }
    },
    {
        path:'/game_list',
        name:'/admin/game',
        meta:{
            title:'遊戲清單'
        }
    },
    {
        path:'/game_info',
        name:'/admin/game',
        meta:{
            title:'遊戲資訊'
        }
    },
    {
        path:'/server_config',
        name:'/admin/game',
        meta:{
            title:'伺服器設定值'
        }
    }
]

const routes = paths.map(function(item,i){
    if (item.path == '/'){
        return{
            path:item.path,
            name:item.name,
            component:Home,
            meta:{
                title:item.meta.title
            }
        }
    }else if(item.path == '/login'){
        return{
            path:item.path,
            name:item.name,
            component:() => import(`@/views${item.path}.vue`),
            meta:{
                title:item.meta.title
            }
        }
    }else{
        return{
            path:item.path,
            name:item.name,
            component:() => import(`@/views${item.name}${item.path}.vue`),
            meta:{
                title:item.meta.title
            }
        }
    }
})

// const routes = [
//     {
//         path: '/',
//         name: 'home',
//         component: Home,
//         meta:{
//             title:'Home'
//         }
//     },
//     {
//         path:'/login',
//         name:'login',
//         component:() => import('@/views/login.vue'),
//         meta:{
//             title:'登入'
//         }
//     },
//     {
//         path:'/admin',
//         name:'admin',
//         component:() => import('@/views/admin/main.vue'),
//         meta:{
//             title:'管理者'
//         }
//     },
//     {
//         path:'/agent',
//         name:'agent',
//         component:() => import('@/views/admin/account/agent.vue'),
//         meta:{
//             title:'代理商管理'
//         }
//     },
//     {
//         path:'/member',
//         name:'member',
//         component:() => import('@/views/admin/account/member.vue'),
//         meta:{
//             title:'會員管理'
//         }
//     },
//     {
//         path:'/account',
//         name:'account',
//         component:() => import('@/views/admin/record/account.vue'),
//         meta:{
//             title:'帳戶設定'
//         }
//     },
//     {
//         path:'/role',
//         name:'role',
//         component:() => import('@/views/admin/record/role.vue'),
//         meta:{
//             title:'角色設定'
//         }
//     },
//     {
//         path:'/access',
//         name:'access',
//         component:() => import('@/views/admin/record/access.vue'),
//         meta:{
//             title:'權限設定'
//         }
//     },
//     {
//         path:'/win_lose',
//         name:'win_lose',
//         component:() => import('@/views/admin/resport/win_lose.vue'),
//         meta:{
//             title:'Win/Lose'
//         }
//     },
//     {
//         path:'/history',
//         name:'history',
//         component:() => import('@/views/admin/resport/history.vue'),
//         meta:{
//             title:'Bet History'
//         }
//     },
//     {
//         path:'/report',
//         name:'report',
//         component:() => import('@/views/admin/resport/report.vue'),
//         meta:{
//             title:'All Report'
//         }
//     },
//     {
//         path:'/wallet',
//         name:'wallet',
//         component:() => import('@/views/admin/resport/wallet.vue'),
//         meta:{
//             title:'Wallet'
//         }
//     },
//     {
//         path:'/login_log',
//         name:'login_log',
//         component:() => import('@/views/admin/record/login_log.vue'),
//         meta:{
//             title:'使用者登入log'
//         }
//     },
//     {
//         path:'/course_log',
//         name:'course_log',
//         component:() => import('@/views/admin/record/course_log.vue'),
//         meta:{
//             title:'歷程log'
//         }
//     }
// ]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next)=>{
    if (to.meta.title){
        document.title = to.meta.title
    }
    next();
})

export default router;
