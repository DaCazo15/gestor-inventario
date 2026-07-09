import { formatearFechaParaMostrar } from './dateFormatter'

export function imprimirReporte(equipo) {
  const ventanaImpresion = window.open('', '_blank')
  const fechaActual = new Date().toLocaleDateString('es-ES')
  const fechaRevisionFormateada = equipo.fechaRevision ? formatearFechaParaMostrar(equipo.fechaRevision) : 'Pendiente'
  const fechaIngresoFormateada = equipo.fechaRegistro ? formatearFechaParaMostrar(equipo.fechaRegistro) : 'No registrada'

  ventanaImpresion.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte Técnico - ${equipo.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
          margin: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-area h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .logo-area p {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 0 0;
        }
        .info-area {
          text-align: right;
        }
        .info-area p {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0;
        }
        .report-title-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .report-title-box h2 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        .grid-details {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
        }
        .detail-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }
        .detail-card h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
        }
        .detail-card p {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }
        .full-width {
          grid-column: span 2;
        }
        .status-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }
        .status-optimo {
          background: #d1fae5;
          color: #065f46;
        }
        .status-reparado {
          background: #e0f2fe;
          color: #0369a1;
        }
        .signature-area {
          margin-top: 100px;
          display: flex;
          justify-content: space-around;
        }
        .signature-box {
          text-align: center;
          width: 200px;
          border-top: 1px solid #94a3b8;
          padding-top: 10px;
          font-size: 13px;
          color: #475569;
        }
        @media print {
          body {
            padding: 20px;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-area">
          <h1>GESTOR DE INVENTARIO</h1>
          <p>Reporte de Control de Activos e Infraestructura</p>
        </div>
        <div class="info-area">
          <p><strong>ID de Reporte:</strong> #REP-${equipo.id}</p>
          <p><strong>Fecha Generación:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div class="report-title-box">
        <h2>Ficha Técnica del Equipo</h2>
      </div>

      <div class="grid-details">
        <div class="detail-card">
          <h3>Nombre del Equipo</h3>
          <p>${equipo.name}</p>
        </div>
        <div class="detail-card">
          <h3>Marca</h3>
          <p>${equipo.marca}</p>
        </div>
        <div class="detail-card">
          <h3>Departamento</h3>
          <p>${equipo.departamento || 'No especificado'}</p>
        </div>
        <div class="detail-card">
          <h3>Estado del Equipo</h3>
          <p>
            <span class="status-badge ${equipo.status ? 'status-optimo' : 'status-reparado'}">
              ${equipo.statusStr || (equipo.status ? 'Óptimo' : 'Reparado')}
            </span>
          </p>
        </div>
        <div class="detail-card">
          <h3>Encargado</h3>
          <p>${equipo.encargado || 'No asignado'}</p>
        </div>
        <div class="detail-card">
          <h3>Notificante</h3>
          <p>${equipo.notificante || 'No asignado'}</p>
        </div>
        <div class="detail-card">
          <h3>ID del Equipo</h3>
          <p>${equipo.idEquipo || 'No registrado'}</p>
        </div>
        <div class="detail-card">
          <h3>Fecha de Ingreso</h3>
          <p>${fechaIngresoFormateada}</p>
        </div>
        <div class="detail-card full-width">
          <h3>Fecha de Revisión</h3>
          <p>${fechaRevisionFormateada}</p>
        </div>
        <div class="detail-card full-width">
          <h3>Descripción y Notas Técnicas</h3>
          <p style="font-weight: 400; line-height: 1.6; color: #334155;">
            ${equipo.description || 'Sin descripción adicional registrada.'}
          </p>
        </div>
      </div>

      <div class="signature-area">
        <div class="signature-box">
          Firma del Encargado
        </div>
        <div class="signature-box">
          Firma Técnico Autorizado
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `)
  ventanaImpresion.document.close()
}

export function imprimirReporteFiltrado(filtroEstadoVal, products) {
  let tituloReporte = ''
  let subTituloReporte = ''
  let listaEquipos = []

  if (filtroEstadoVal === 'all') {
    tituloReporte = 'Reporte General de Inventario'
    subTituloReporte = 'Todos los equipos registrados'
    listaEquipos = products
  } else if (filtroEstadoVal === 'active') {
    tituloReporte = 'Reporte de Equipos Óptimos'
    subTituloReporte = 'Equipos operativos que no han requerido servicio técnico'
    listaEquipos = products.filter(p => p.status === true)
  } else if (filtroEstadoVal === 'inactive') {
    tituloReporte = 'Reporte de Equipos Reparados'
    subTituloReporte = 'Equipos recuperados y puestos a punto'
    listaEquipos = products.filter(p => p.status === false)
  }

  // Group by department
  const equiposPorDepartamento = {}
  listaEquipos.forEach(equipo => {
    const depto = equipo.departamento || 'Sin Departamento'
    if (!equiposPorDepartamento[depto]) {
      equiposPorDepartamento[depto] = []
    }
    equiposPorDepartamento[depto].push(equipo)
  })

  const ventanaImpresion = window.open('', '_blank')
  const fechaActual = new Date().toLocaleDateString('es-ES')
  
  let htmlContenido = ''
  const departamentosOrdenados = Object.keys(equiposPorDepartamento).sort()
  
  if (departamentosOrdenados.length === 0) {
    htmlContenido = '<p style="text-align: center; color: #64748b; margin-top: 50px;">No hay equipos registrados en esta sección.</p>'
  } else {
    departamentosOrdenados.forEach(depto => {
      htmlContenido += `
        <div class="depto-section">
          <h3 class="depto-title">${depto}</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 15%;">ID Equipo</th>
                <th style="width: 25%;">Nombre</th>
                <th style="width: 20%;">Marca</th>
                <th style="width: 20%;">Encargado</th>
                <th style="width: 20%;">Estado</th>
              </tr>
            </thead>
            <tbody>
      `
      
      equiposPorDepartamento[depto].forEach(equipo => {
        const estadoLabel = equipo.statusStr || (equipo.status ? 'Óptimo' : 'Reparado')
        const badgeClass = equipo.status ? 'status-optimo' : 'status-reparado'
        htmlContenido += `
          <tr>
            <td><strong>${equipo.idEquipo || 'S/N'}</strong></td>
            <td>
              <div style="font-weight: 600;">${equipo.name}</div>
              ${equipo.description ? `<div class="desc-text">${equipo.description}</div>` : ''}
            </td>
            <td>${equipo.marca}</td>
            <td>${equipo.encargado || 'No asignado'}</td>
            <td>
              <span class="status-badge ${badgeClass}">${estadoLabel}</span>
            </td>
          </tr>
        `
      })
      
      htmlContenido += `
            </tbody>
          </table>
        </div>
      `
    })
  }

  ventanaImpresion.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${tituloReporte}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
          margin: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-area h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .logo-area p {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 0 0;
        }
        .info-area {
          text-align: right;
        }
        .info-area p {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0;
        }
        .report-title-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .report-title-box h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        .report-title-box p {
          font-size: 14px;
          color: #475569;
          margin: 6px 0 0 0;
        }
        .depto-section {
          margin-bottom: 35px;
          break-inside: avoid;
        }
        .depto-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          border-bottom: 2px solid #00b4d8;
          padding-bottom: 6px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }
        .report-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
        }
        .report-table td {
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          vertical-align: top;
        }
        .report-table tr:nth-child(even) td {
          background: #f8fafc;
        }
        .desc-text {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
          line-height: 1.4;
        }
        .status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .status-optimo {
          background: #d1fae5;
          color: #065f46;
        }
        .status-reparado {
          background: #e0f2fe;
          color: #0369a1;
        }
        .signature-area {
          margin-top: 80px;
          display: flex;
          justify-content: space-around;
          break-inside: avoid;
        }
        .signature-box {
          text-align: center;
          width: 220px;
          border-top: 1px solid #94a3b8;
          padding-top: 10px;
          font-size: 12px;
          color: #475569;
        }
        @media print {
          body {
            padding: 20px;
          }
          .depto-section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-area">
          <h1>GESTOR DE INVENTARIO</h1>
          <p>Reporte de Control de Activos e Infraestructura</p>
        </div>
        <div class="info-area">
          <p><strong>Fecha Generación:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div class="report-title-box">
        <h2>${tituloReporte}</h2>
        <p>${subTituloReporte}</p>
      </div>

      ${htmlContenido}

      <div class="signature-area">
        <div class="signature-box">
          Firma Responsable Inventario
        </div>
        <div class="signature-box">
          Firma Dirección de Tecnología
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `)
  ventanaImpresion.document.close()
}

export function imprimirReporteServicios(filtroServicioVal, products) {
  let tituloReporte = ''
  let subTituloReporte = ''
  let listaEquipos = []

  if (filtroServicioVal === 'todos') {
    tituloReporte = 'Registro General de Servicios'
    subTituloReporte = 'Todos los equipos registrados en el sistema'
    listaEquipos = products
  } else if (filtroServicioVal === 'reparar') {
    tituloReporte = 'Registro de Equipos Por Reparar'
    subTituloReporte = 'Equipos pendientes de servicio técnico'
    listaEquipos = products.filter(p => {
      const estado = p.statusStr || (p.status ? 'Óptimo' : 'Reparado')
      return estado === 'Reparado'
    })
  } else if (filtroServicioVal === 'danados') {
    tituloReporte = 'Registro de Equipos Dañados'
    subTituloReporte = 'Equipos con daños reportados que requieren atención'
    listaEquipos = products.filter(p => {
      const estado = p.statusStr || (p.status ? 'Óptimo' : 'Reparado')
      return estado === 'Dañado'
    })
  }

  const equiposPorDepartamento = {}
  listaEquipos.forEach(equipo => {
    const depto = equipo.departamento || 'Sin Departamento'
    if (!equiposPorDepartamento[depto]) {
      equiposPorDepartamento[depto] = []
    }
    equiposPorDepartamento[depto].push(equipo)
  })

  const ventanaImpresion = window.open('', '_blank')
  const fechaActual = new Date().toLocaleDateString('es-ES')

  let htmlContenido = ''
  const departamentosOrdenados = Object.keys(equiposPorDepartamento).sort()

  if (departamentosOrdenados.length === 0) {
    htmlContenido = '<p style="text-align: center; color: #64748b; margin-top: 50px;">No hay equipos registrados en esta sección.</p>'
  } else {
    departamentosOrdenados.forEach(depto => {
      htmlContenido += `
        <div class="depto-section">
          <h3 class="depto-title">${depto}</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 12%;">ID Equipo</th>
                <th style="width: 20%;">Nombre</th>
                <th style="width: 15%;">Marca</th>
                <th style="width: 15%;">Encargado</th>
                <th style="width: 15%;">Notificante</th>
                <th style="width: 13%;">Estado</th>
                <th style="width: 10%;">Revisión</th>
              </tr>
            </thead>
            <tbody>
      `

      equiposPorDepartamento[depto].forEach(equipo => {
        const estadoLabel = equipo.statusStr || (equipo.status ? 'Óptimo' : 'Reparado')
        const badgeClass = equipo.status ? 'status-optimo' : 'status-reparado'
        const fechaRev = equipo.fechaRevision || 'Pendiente'
        htmlContenido += `
          <tr>
            <td><strong>${equipo.idEquipo || 'S/N'}</strong></td>
            <td>
              <div style="font-weight: 600;">${equipo.name}</div>
              ${equipo.description ? `<div class="desc-text">${equipo.description}</div>` : ''}
            </td>
            <td>${equipo.marca}</td>
            <td>${equipo.encargado || 'No asignado'}</td>
            <td>${equipo.notificante || 'No asignado'}</td>
            <td>
              <span class="status-badge ${badgeClass}">${estadoLabel}</span>
            </td>
            <td>${fechaRev}</td>
          </tr>
        `
      })

      htmlContenido += `
            </tbody>
          </table>
        </div>
      `
    })
  }

  ventanaImpresion.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${tituloReporte}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #ffffff;
          padding: 40px;
          margin: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-area h1 {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .logo-area p {
          font-size: 12px;
          color: #64748b;
          margin: 4px 0 0 0;
        }
        .info-area {
          text-align: right;
        }
        .info-area p {
          font-size: 13px;
          color: #64748b;
          margin: 4px 0;
        }
        .report-title-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .report-title-box h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
        .report-title-box p {
          font-size: 14px;
          color: #475569;
          margin: 6px 0 0 0;
        }
        .depto-section {
          margin-bottom: 35px;
          break-inside: avoid;
        }
        .depto-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          border-bottom: 2px solid #f59e0b;
          padding-bottom: 6px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 12px;
        }
        .report-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 9px;
          letter-spacing: 0.5px;
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
        }
        .report-table td {
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
          vertical-align: top;
        }
        .report-table tr:nth-child(even) td {
          background: #f8fafc;
        }
        .desc-text {
          font-size: 10px;
          color: #64748b;
          margin-top: 3px;
          line-height: 1.4;
        }
        .status-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .status-optimo {
          background: #d1fae5;
          color: #065f46;
        }
        .status-reparado {
          background: #e0f2fe;
          color: #0369a1;
        }
        .signature-area {
          margin-top: 80px;
          display: flex;
          justify-content: space-around;
          break-inside: avoid;
        }
        .signature-box {
          text-align: center;
          width: 220px;
          border-top: 1px solid #94a3b8;
          padding-top: 10px;
          font-size: 12px;
          color: #475569;
        }
        @media print {
          body {
            padding: 20px;
          }
          .depto-section {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-area">
          <h1>REGISTRO DE SERVICIOS</h1>
          <p>Control y Seguimiento de Servicios Técnicos</p>
        </div>
        <div class="info-area">
          <p><strong>Fecha Generación:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div class="report-title-box">
        <h2>${tituloReporte}</h2>
        <p>${subTituloReporte}</p>
      </div>

      ${htmlContenido}

      <div class="signature-area">
        <div class="signature-box">
          Firma Responsable de Servicios
        </div>
        <div class="signature-box">
          Firma Dirección de Tecnología
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      <\/script>
    </body>
    </html>
  `)
  ventanaImpresion.document.close()
}
