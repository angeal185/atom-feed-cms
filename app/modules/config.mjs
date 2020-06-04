import { utils } from './utils.mjs';

const config = {
  nav_items: ['dashboard','feed', 'entry', 'edit', 'settings'],
  nav_base: 0,
  max_entries: 50,
  entry_singles: ['title','summary','published','rights'],
  entry_groups: ['link', 'author', 'category', 'content', 'source'],
  new_entry: {
    title: '',
    updated: new Date().toISOString(),
    id: 'urn:uuid:'+ utils.uuid(),
    summary: '',
    published:  new Date().toISOString(),
    rights: '',
    author: {
      email: '',
      name: '',
      uri: ''
    },
    category: {
      term: '',
      label: '',
      scheme: ''
    },
    content: {
      type: '',
      src: '',
      data: ''
    },
    link: {
      type: '',
      rel: '',
      title: '',
      href: '',
      hreflang: ''
    },
    source:{
      id: '',
      title: '',
      updated: ''
    },
    contributor: []
  },
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
