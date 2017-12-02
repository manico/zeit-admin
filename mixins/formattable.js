import moment from 'moment'

export default {
  methods: {
    formatDateTime (value) {
      return moment.utc(value).format('LLL')
    }
  }
}
