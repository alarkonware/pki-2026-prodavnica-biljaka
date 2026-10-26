import Swal from "sweetalert2"
import type { OrderModel } from "./models/order.model"

export function formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatDay(iso: string) {
    return new Date(iso).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

export function getOrderPrice(order: OrderModel) {
    return order.pricePerPlant * order.quantity
}

// Ukupna vrednost rezervacija na cekanju: racunaju se samo one sa statusom 'rezervisano'
export function getCartTotal(orders: OrderModel[]) {
    let total = 0
    for (let order of orders) {
        if (order.status == 'rezervisano') {
            total += getOrderPrice(order)
        }
    }

    return total
}

// zajednicka podesavanja za sve SweetAlert prozore (Bootstrap klase na dugmadima)
const dialog = Swal.mixin({
    customClass: {
        popup: 'card',
        cancelButton: 'btn btn-outline-secondary ms-2',
        confirmButton: 'btn btn-success'
    },
    buttonsStyling: false,
    confirmButtonText: 'U redu'
})

export function askConfirm(question: string, onConfirm: () => void) {
    dialog.fire({
        icon: 'question',
        title: question,
        showCancelButton: true,
        confirmButtonText: 'Da, potvrdi!',
        cancelButtonText: 'Ne, odustani!'
    }).then(answer => {
        if (answer.isConfirmed) {
            onConfirm()
        }
    })
}

export function notifySuccess(text = '') {
    dialog.fire({ icon: 'success', title: 'Uspešno', text })
}

export function notifyError(text: string) {
    dialog.fire({ icon: 'error', title: 'Greška', text })
}

// Ako slika biljke ne postoji u public/plants, prikazi zamensku
export function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (!img.src.endsWith('placeholder.svg')) {
    img.src = '/plants/placeholder.svg'
  }
}

// Prozor posle uspesne rezervacije: korisnik bira sta dalje
export function reservedDialog(onView: () => void, onContinue: () => void) {
    dialog.fire({
        icon: 'success',
        title: 'Biljka je rezervisana',
        text: 'Dodata je u vaše rezervacije. Šta želite dalje?',
        showCancelButton: true,
        confirmButtonText: 'Pogledaj rezervacije',
        cancelButtonText: 'Nastavi sa biranjem',
        allowOutsideClick: false
    }).then(answer => {
        if (answer.isConfirmed) {
            onView()
        } else {
            onContinue()
        }
    })
}
