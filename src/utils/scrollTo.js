/**
 * This is modified from code provided by Robbendebiene on stackoverflow
 * http://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
 */
export default function scrollTo (end, scrollDuration) {
  const el = this
  const start = el.scrollTop
  const offset = end - start
  
  var oldTimestamp = 0
  var progress = 0

  function _step (newTimestamp) {
    progress += (scrollDuration / (newTimestamp - oldTimestamp))

    if (progress >= 1) el.scrollTop = end
    if (el.scrollTop === end) return

    el.scrollTop = start + (1 - Math.round(Math.cos(Math.PI * progress))) * offset
    oldTimestamp = newTimestamp
    window.requestAnimationFrame(_step)
  }

  oldTimestamp = performance.now()
  window.requestAnimationFrame(_step)
}
