var issues = Vue.component('issues', {
  firebase: {
    issues: {
      source: db.ref('issues'),
      asObject: false
    },
    notes: {
      source: db.ref('notes'),
      asObject: false
    }
  },
  methods: {
    showIssue (node) {
      let issue = this.issues.find(i => i.id === node.id)
      issue.comments = this.notes.filter(note => note.issue_id === issue.id)
      this.$emit('returnIssue', issue)
    }
  },
  template: `
  <section>
    {{issues}}
    <ul class="list-group list-group-flush">
      <button type="button" class="list-group-item list-group-item-action" v-for="issue in issues" :key="issue.id" style="padding: 5px 12px">
        {{issue.title}}
        <span style="float: right" :class="{'label': true, 'label-danger':issue.state === 'closed', 'label-success': issue.state === 'open','label-pill':true}">{{issue.state}}</span>
      </button>
    </ul>
  </section>
  `
})