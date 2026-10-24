/* -----------------------------------------------------------------------------
* toggleMembershipPlan
----------------------------------------------------------------------------- */
export function toggleMembershipPlan() {
  const plan = document.querySelector('[data-plan]')
  plan.getAttribute('data-plan') === 'yearly' 
    ? plan.setAttribute('data-plan', 'monthly') 
    : plan.setAttribute('data-plan', 'yearly') 
}

/* -----------------------------------------------------------------------------
* calculateDiscount
----------------------------------------------------------------------------- */
export function calculateDiscounts() {
  document.querySelectorAll('[data-discount][data-monthly-price]').forEach(plan => {
    const monthly = parseFloat(plan.getAttribute('data-monthly-price'));
    const yearly = parseFloat(plan.getAttribute('data-yearly-price'));
    const discount = Math.round(100 - parseInt((yearly/(12*monthly)) * 100));
    if ( discount > 0 && discount < 100 ) {
      plan.setAttribute('data-discount', `${discount}%`);
      plan.classList.remove('hidden')
    }
  })
}