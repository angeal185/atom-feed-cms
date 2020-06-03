import { utils } from './utils.mjs';

const base_path = location.href.split('/')[1];
const config = {
  app_path: base_path,
  nav_items: ['dashboard','feed', 'entries', 'settings'],
  nav_base: 0,
  new_schema: {
    title: '',
    subtitle: '',
    icon: '',
    logo: '',
    updated: new Date().toISOString(),
    id: 'urn:uuid:'+ utils.uuid(),
    rights:'',
    generator: '',
    link: {
      type: '',
      rel: '',
      title: '',
      href: '',
      hreflang: ''
    },
    category: {
      term: '',
      label: '',
      scheme: ''
    },
    author: {
      email: '',
      name: '',
      uri: ''
    },
    contributor: [],
    entries: []
  }
}

Object.freeze(config);

export { config }
