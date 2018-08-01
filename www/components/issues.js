// get vue component
new Vue({
  el: '#issues',
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
    sendIssue (issue) {
      issue.comments = this.notes.filter(note => note.issue_id === issue.id)
      window.dispatchEvent(new CustomEvent('onIssueData', {'detail': issue}))
    }
  },
  template: `
  <section>
    <ul class="list-group list-group-flush">
      <button @click="sendIssue(issue)" type="button" class="list-group-item list-group-item-action" v-for="issue in issues" :key="issue.id" style="padding: 5px 12px">
        {{issue.title}}
        <span style="float: right position: relative; top: -1px;" :class="{'label': true, 'label-danger':issue.state === 'closed', 'label-success': issue.state === 'open','label-pill':true}">{{issue.state}}</span>
      </button>
    </ul>
  </section>
  `
})
