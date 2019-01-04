export default {
  'GET /api/v1/base/%2Fmenu': {
    "code": 0,
    "data": {
      "left": [{
        path: '/form',
        icon: 'form',
        name: 'menu1left',
        children: [
          {
            path: '/form/basic-form',
            name: 'menu1-1',
            authority: ['logined'],
          },
          {
            path: '/form/step-form',
            name: 'menu1-2',
            children: [
              {
                path: '/form/step-form/info',
                name: 'menu1-2-1',
                authority: [1],
              },
              {
                path: '/form/step-form/confirm',
                name: 'menu1-2-2',
                authority: [2],
              },
              {
                path: '/form/step-form/result',
                name: 'menu1-2-3',
                authority: [3],
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: [4],
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        children: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            authority: [0],
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            children: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
              },
            ],
          },
        ],
      },],
      "inside": [{
        path: '/list/table-list',
        name: 'searchtable',
      }, {
        path: '/form',
        icon: 'form',
        name: 'form',
        children: [
          {
            path: '/form/basic-form',
            name: 'basicform',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            children: [
              {
                path: '/form/step-form/info',
                name: 'info',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        children: [
          {
            path: '/list/table-list',
            name: 'searchtable',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            children: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
              },
            ],
          },
        ],
      }],
      "right": [{ path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        children: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        children: [
          {
            path: '/account/settings',
            name: 'settings',
          },
        ],
      },
      ]
    },
    "msg": "Request success"
  },
  'GET /api/v1/base/%2Fi18n%2Fen-US': {
    "code": 0,
    "data": {
      "cancel": "Cancel",
      "upload": "Upload",
      "image.must.smaller.t": "Image must smaller than {num}MB!",
      "you.can.only.upload.": "You can only upload {type} file!",
      "upload.error": "Upload error",
      "data.not.found": "Data not found",
      "remove.this.binding": "Remove this binding",
      "bind.wechat.success": "Bind Wechat Success",
      "bind.new.email": "Bind new Email",
      "the.account.has.been1544407957040": "The account has been bound Emails",
      "type.in.the.number.y": "Type in the number you want to delete",
      "login.first": "Login first",
      "the.last.email.canno": "The last email cannot be deleted",
      "the.last.number.cann": "The last number cannot be deleted",
      "the.email.is.incorre": "The email is incorrect or does not belong to you",
      "the.number.is.incorr": "The number is incorrect or does not belong to you",
      "succeed": "Succeed",
      "the.account.has.been": "The account has been bound to the mobile phone",
      "bind.new.phone": "Bind new phone",
      "bind.wechat": "Bind wechat",
      "bind.email": "Bind email",
      "bind.phone": "Bind phone",
      "bind.old.account": "Bind old account",
      "update.avatar": "Update avatar",
      "{nickname}.invites.y": "{nickname} invites you to manage {name} info in HiredChina.com",
      "{nickname}.invites.{": "{nickname} invites {firstName} {lastName} to use HiredChina.com",
      "hiredchina.com.invit": "HiredChina.com Invite",
      "login.by.wechat": "Login by Wechat",
      "login.by.email": "Login by email",
      "login.by.mobile": "Login by mobile",
      "you.already.have.oth": "You already have other companies under management",
      "if.you.are.the.hr": "If you are the HR",
      "invites.you.to.manag": "Invites you to manage this company in HiredChina.com",
      "if.you.are": "If you are",
      "invites.you.to.use.t": "Invites you to use the services of HiredChina.com",
      "use.wechat.login": "Use WeChat login",
      "{email}.can.use,.get": "{email} can use, get the captcha to register",
      "{email}.registered,.": "{email} registered, get the captcha to login",
      "captcha": "Captcha",
      "email": "Email",
      "it.is.not.valid.e-ma": "It is not valid E-mail!",
      "please.input.your.e-": "Please input your E-mail!",
      "{phone}.can.use,.get": "{phone} can use, get the captcha to register",
      "click.on.the.modify": "Click on the modify",
      "login": "Login",
      "languages": "Languages",
      "you.have.viewed.all.1542349435507": "You have viewed all messsages.",
      "message": "Message",
      "you.have.viewed.all.": "You have viewed all notifications.",
      "notification": "Notification",
      "no.notifications": "No notifications",
      "help": "Help",
      "search": "Search",
      "logout": "Logout",
      "account.center": "Account Center",
      "sorry,.the.server.is": "Sorry, the server is reporting an error",
      "back.to.home": "Back to home",
      "sorry,.you.don't.hav": "Sorry, you don't have access to this page",
      "cleared": "Cleared",
      "sorry,.the.page.you.": "Sorry, the page you visited does not exist",
      "invalid.captcha": "Invalid Captcha",
      "the.captcha.has.been": "The captcha has been sent!",
      "{phone}.registered,.": "{phone} registered, get the captcha to login",
      "we.must.make.sure.th": "We must make sure that your are a human.",
      "get.captcha": "Get captcha",
      "please.input.the.cap": "Please input the captcha you got!",
      "mobile": "Mobile",
      "please.enter.mobile.": "Please enter mobile number!",
      "congo.+242": "Congo +242",
      "colombia.+57": "Colombia +57",
      "china.+86": "China +86",
      "Clear": "Clear",
      "Save": "Save",
      "en-US": "EN",
      "zh-CN": "中文"
    },
    "msg": "Request success"
  },
  'GET /api/v1/base/%2Fi18n%2Fzh-CN': {
    "code": 0,
    "data": {
      "cancel": "取消",
      "upload": "上传",
      "image.must.smaller.t": "图片不能超过{num}MB!",
      "you.can.only.upload.": "只能上传 {type} 类型的文件",
      "upload.error": "上传错误",
      "data.not.found": "数据没找到",
      "remove.this.binding": "解除绑定",
      "bind.wechat.success": "已成功绑定微信",
      "bind.new.email": "绑定新邮箱",
      "the.account.has.been1544407957040": "账号已绑定邮箱",
      "type.in.the.number.y": "输入要删除的号码",
      "login.first": "请先登录",
      "the.last.email.canno": "这是你最后一个邮箱，删除了我们就联系不了你了",
      "the.last.number.cann": "这是你最后一个号码，删除了我们就联系不了你了",
      "the.email.is.incorre": "邮箱不正确，或该邮箱不属于您",
      "the.number.is.incorr": "号码不正确，或该号码不属于您",
      "succeed": "操作成功",
      "the.account.has.been": "账号已绑定手机",
      "bind.new.phone": "绑定新号码",
      "bind.wechat": "绑定微信",
      "bind.email": "绑定邮箱",
      "bind.phone": "绑定手机",
      "bind.old.account": "绑定旧账号",
      "update.avatar": "更新头像",
      "{nickname}.invites.y": "{nickname} 邀请您管理 {name} 公司档案",
      "{nickname}.invites.{": "{nickname} 邀请 {firstName} {lastName} 使用在华外国人才网",
      "hiredchina.com.invit": "在华外国人才网邀请",
      "login.by.wechat": "微信登录",
      "login.by.email": "邮箱登录",
      "login.by.mobile": "手机登录",
      "you.already.have.oth": "您已经有其他公司在管理",
      "if.you.are.the.hr": "如果您是该公司的HR",
      "invites.you.to.manag": "邀请您管理HiredChina.com的公司",
      "if.you.are": "如果您是",
      "invites.you.to.use.t": "邀请您使用HiredChina.com的服务",
      "use.wechat.login": "使用微信登录",
      "{email}.can.use,.get": "{email} 是新用户，收取验证后便可注册",
      "{email}.registered,.": "{email} 已经注册，获取验证码登录吧！",
      "captcha": "验证码",
      "email": "邮箱地址",
      "it.is.not.valid.e-ma": "这不是有效的邮箱地址",
      "please.input.your.e-": "请输入您的邮箱地址",
      "{phone}.can.use,.get": "{phone} 是新用户，收取验证后便可注册",
      "click.on.the.modify": "点击修改",
      "login": "登录",
      "languages": "语言",
      "you.have.viewed.all.1542349435507": "您已读完所有消息",
      "message": "消息",
      "you.have.viewed.all.": "你已查看所有通知",
      "notification": "通知",
      "no.notifications": "没有新消息",
      "help": "使用文档",
      "search": "搜索",
      "logout": "退出登录",
      "account.center": "个人中心",
      "sorry,.the.server.is": "抱歉，服务器出错了",
      "back.to.home": "返回首页",
      "sorry,.you.don't.hav": "抱歉，你无权访问该页面",
      "cleared": "清空了",
      "sorry,.the.page.you.": "抱歉，你访问的页面不存在",
      "invalid.captcha": "验证码错误",
      "the.captcha.has.been": "验证码已发送！",
      "{phone}.registered,.": "{phone} 已经注册，获取验证码登录吧！",
      "we.must.make.sure.th": "我们想确认这不是机器在操作。",
      "get.captcha": "发送验证码",
      "please.input.the.cap": "输入您收到的验证码！",
      "mobile": "手机号码",
      "please.enter.mobile.": "请输入您的手机号码！",
      "congo.+242": "刚果 +242",
      "colombia.+57": "哥伦比亚 +57",
      "china.+86": "中国 +86",
      "Clear": "清空",
      "Save": "保存",
      "en-US": "EN",
      "zh-CN": "中文"
    },
    "msg": "请求成功"
  },
  'GET /api/v1/base/%2Fpath%2Floginweb': {
    "data": "http://localhost:8000"
  },
  'GET /api/v1/base/%2Fpath%2Fhcweb': {
    "data": "http://hiredchina.com"
  },
  'GET /api/v1/base/current': {
    "code": 0,
    "data": {
      "createdAtFormat": "2018-11-16 10:32",
      "updatedAtFormat": "2018-12-13 11:40",
      "lastAtFormat": "2018-11-16 10:32",
      "mobilePhone": "86_13422517821",
      "email": "thoams@qq.com",
      "nickname": "Thomas Lau",
      "lastAt": "2018-11-16T02:32:59.000Z",
      "isLock": false,
      "lastLanguage": "zh",
      "headimgurl": "http://image.hiredchina.com/FpxXVRh34w3zIfxyMG-app_bLRpd",
      "genderType": 0,
      "createdAt": "2018-11-16T02:32:59.000Z",
      "updatedAt": "2018-12-13T03:40:37.000Z",
      "roles": [0, "logined"]
    },
    "msg": "请求成功",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6Mn0sImV4cCI6MTU0NTIxNDU4NiwiaWF0IjoxNTQ0NjA5Nzg2fQ.o7XepgzaqTgNPIhOXSxpbJmE1eH-3odXHJ_YvUEF88E"
  },
  'GET /api/v1/base/%2Fsystem': {
    "code": 0,
    "data": {
      "nameKey": "loginapi",
      "titleKey": "login",
      "keyworkKey": "login",
      "descriptionKey": "login",
      "logoUrl": "http://image.hiredchina.com/logo.jpg",
      "miniLogoUrl": "http://image.hiredchina.com/FpxXVRh34w3zIfxyMG-app_bLRpd",
      "copyrightKey": "",
      "recordCode": ""
    }
  },
  'GET /api/v1/base/%2Ffooter': {
    "code": 0,
    "data": {
      social: [
        {
          icon: 'facebook',
          href: 'https://www.facebook.com/HiredChina',
        },
        {
          icon: 'linkedin',
          href: 'https://www.linkedin.com/company-beta/5051303/',
        },
        {
          icon: 'twitter',
          href: 'https://twitter.com/HiredChina',
        },{
          icon: 'weibo',
          href: 'https://weibo.com/u/5492401803',
        },
      ],
      links: [
        {
          key: 'For Job Seekers',
          title: 'For Job Seekers',
          href: 'https://pro.ant.design',
          blankTarget: true,
          children: [
            {
              key: 'Find Jobs',
              title: 'Find Jobs',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Upload Resume',
              title: 'Upload Resume',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Salary',
              title: 'Salary',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Help',
              title: 'Help',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            }
          ]
        },
        {
          key: 'For Employers',
          title: 'For Employers',
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
          children: [
            {
              key: 'Post Jobs',
              title: 'Post Jobs',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Search Resumes',
              title: 'Search Resumes',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Executive Service',
              title: 'Executive Service',
              img: 'http://www.hiredchina.com/img/consulting.jpeg',
            },
          ]
        },
        {
          key: 'About Us',
          title: 'About Us',
          href: 'https://ant.design',
          blankTarget: true,
          children: [
            {
              key: 'Phone',
              title: '(86) 0755 21654992',
              icon: 'phone',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Email',
              title: 'info@hiredchina.com',
              icon: 'mail',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Subscribe',
              title: 'Subscribe',
              img: 'http://www.hiredchina.com/img/guideinchina_code.png',
            }
          ]
        },{
          key: 'Find Foreigners',
          title: 'Find Foreigners',
          href: 'https://ant.design',
          blankTarget: true,
          children: [
            {
              key: 'Part time',
              title: 'Part time',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Teacher',
              title: 'Teacher',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Experts',
              title: 'Experts',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Other',
              title: 'Other',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            }
          ]
        },{
          key: 'Find Jobs',
          title: 'Find Jobs',
          href: 'https://ant.design',
          blankTarget: true,
          children: [
            {
              key: 'Part time Jobs',
              title: 'Part time',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Teacher',
              title: 'Teacher',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Senior',
              title: 'Experts',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            },
            {
              key: 'Other Jobs',
              title: 'Other',
              href: 'https://github.com/ant-design/ant-design-pro',
              blankTarget: true,
            }
          ]
        },
      ]
    }
  }
}
