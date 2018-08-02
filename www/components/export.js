function showExportPanel (issues) {
  return new Vue({
    el: '#exportpanel',
    data: {
      issues: issues,
      checkedIssues: {}
    },
    mounted () {
      $('#exportModal').modal('show');
    },
    methods: {
      exportIssues () {
        console.log(this.checkedIssues)
      }
    },
    template: `
    <div id="exportModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">Export Issues</h4>
        </div>
        <div class="modal-body">
          <div class="form-check" v-for="issue in issues" :key="issue.id">
            <input v-model="checkedIssues[issue.id]" class="form-check-input" type="checkbox" value="">
            <label class="form-check-label">
              {{issue.title}}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="exportIssues">Export</button>
        </div>
      </div>
    </div>
  </div>
    `
  })
}

window.addEventListener('onShowExport', e => {
  showExportPanel(e.detail)
})