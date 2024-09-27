// script.js

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
  
    // Añadir evento al formulario de filtros
    document.getElementById('filters-form').addEventListener('submit', (event) => {
      event.preventDefault();
      fetchData();
    });
  });
  
  async function fetchData() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const category = document.getElementById('category').value;
  
    // Construir la URL de la API con los parámetros de filtro
    let apiUrl = 'https://api.example.com/data';
    const params = [];
    if (startDate) params.push(`start-date=${startDate}`);
    if (endDate) params.push(`end-date=${endDate}`);
    if (category && category !== 'all') params.push(`category=${category}`);
    if (params.length) apiUrl += '?' + params.join('&');
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      updateTable(data);
      updateCharts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  function updateTable(data) {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = '';
  
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.month}</td>
        <td>$${item.sales}</td>
        <td>${item.orders}</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  function updateCharts(data) {
    const salesChartCtx = document.getElementById('salesChart').getContext('2d');
    const ordersChartCtx = document.getElementById('ordersChart').getContext('2d');
  
    const months = data.map(item => item.month);
    const sales = data.map(item => item.sales);
    const orders = data.map(item => item.orders);
  
    new Chart(salesChartCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Ventas',
          data: sales,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    new Chart(ordersChartCtx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Pedidos',
          data: orders,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }