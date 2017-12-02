export default {
  aliases: [],
  auth: {
    tokens: [
      { name: 'default', value: 'NHn7hsxYpqtePquExcikQZxR', active: true },
      { name: 'invalid', value: 'NHn7hsxYpqtePquExcikQZxP' }
    ]
  },
  error: null,
  deployments: [],
  deploymentProjects: [],
  menus: {
    main: [
      { to: 'index', title: 'Home', icon: 'widgets', exact: true },
      { to: 'deployments', title: 'Deployments', icon: 'cloud', exact: false },
      { to: 'files', title: 'Files', icon: 'folder', exact: false }
    ]
  }
}
