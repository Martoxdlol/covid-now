import openDialog from 'dialogspp'
import BottomSheet from 'dialogspp/bottomsheet'
import React, { useState } from 'react'

export default async history => {
  'Abrir menu de filtros'

  return new Promise((resolve, reject) => {
    openDialog(history, props => {
      const [order, setOrder] = useState('deaths_per_1m_population')
      const close = props.close
      props.addCloseListener(e => resolve(null))
      return <BottomSheet {...props}>
        <div className="container filter-settings">
          <div className="buttons">
            <button onClick={close}>Cancelar</button>
            <button onClick={e => {
              resolve({
                filter_order: [order],
                order_mode: "desc"
              })
              close()
            }}>Aplicar</button>
          </div>
          <div><button onClick={e => setOrder('cases')} style={{fontWeight:order == "cases" ? "bold" : "500"}}>casos</button></div>
          <div><button onClick={e => setOrder('deaths_per_1m_population')} style={{fontWeight:order == "deaths_per_1m_population" ? "bold" : "500"}}>muertes por millón</button></div>
          <div><button onClick={e => setOrder('deaths')} style={{fontWeight:order == "deaths" ? "bold" : "500"}}>muertes</button></div>
        </div>
      </BottomSheet>
    })
  })
}
