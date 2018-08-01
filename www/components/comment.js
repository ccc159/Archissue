Vue.component('comment', {
  props: ['note'],
  template: `
  <div v-if="note" style="font-size: 12px; display: flex; margin-top:8px;">
    <!-- icon -->
    <div >
      <span style="display: block; font-size: 21px; text-align: center; width: 32px; height: 32px; border-radius: 16px; background:#5bc0de; margin-right: 8px;">{{note.author.charAt(0)}}</span>
    </div>
    <div style="flex: auto;">
      <!-- state -->
      <strong>{{note.author}}</strong>
      commented {{timeago().format(note.created_at)}}
      <!-- body -->
      <p style="color: #bdbdbd;">{{note.body}}</p>
    </div>
  </div>
  `
})