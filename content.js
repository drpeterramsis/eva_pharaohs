
//////***** Simulation Content *******\\\\\

/////////  Builders //////////


// 1- Builders-main
document.getElementById("builders-main").onclick = function() {
    showNotifier(`
        <h1 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">The Builders of the Monument of Glory</h1>
        
        <p><strong style="color: #000; font-weight: bold;">Welcome, Honored Architects of the Empire</strong></p>
        
        <p>You have been chosen by the Pharaoh to shape the legacy of our great civilization.<br>
        With our skills and vision, the kingdom shall rise in stone and spirit. Your work will speak to generations and reflect the strength, wisdom, and uniqueness of our empire.</p>
        
        <p>You shall <strong style="color: #000; font-weight: bold;">design & construct the Great monument</strong> to proclaim our empire's unmatched glory. <strong style="color: #000; font-weight: bold;">Let this structure differentiate your empire from all others</strong>, showing creativity, resourcefulness, and collaboration.</p>
        
        <p>Build not just with stone, but with vision, making your monument a living brand of the Pharaoh's vision and leadership, a symbol of power, unity, and national pride.</p>
    `);
};


// 2- builders-Responsibilities
document.getElementById("builders-Responsibilities").onclick = function() {
    showNotifier(`
  <style>
    .notifier-container {
      font-family: Arial, sans-serif;
      max-width: 800px;
    }
    .header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #ddd;
    }
    .checkbox-container {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    .checkbox-item {
      display: block;
      padding: 12px 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .checkbox-item:nth-child(odd) {
      background-color: #f8f8f8;
    }
    .checkbox-item:nth-child(even) {
      background-color: #ffeeba;
    }
    .checkbox-item input {
      margin-right: 10px;
    }
    .checkbox-item span {
      font-weight: bold !important;
    }
  </style>

  <div class="notifier-container">
    <div class="header">❖ Builders Divine Responsibilities:</div>
    
    <div class="checkbox-container">
      <label class="checkbox-item">
        <input type="checkbox" id="builder-resp-1">
        I. Construct <span>the monument</span> using the materials provided, Await the name and guiding identity from the <span>Strategic Leaders</span> to reflect the kingdom's <span>vision</span> in your design.
      </label>
      
      <label class="checkbox-item">
        <input type="checkbox" id="builder-resp-2">
        II. Visualize our kingdom's <span>unique story narrative</span> and <span>logo</span> that will both be drawn on our <span>temple's walls</span>, make sure they <span>align with the empire's values</span> and explain the symbolism, history, and cultural importance of your monument.
      </label>
    </div>
  </div>

  <script>
    // Load saved states when notifier appears
    document.querySelectorAll('.checkbox-item input').forEach(checkbox => {
      const savedState = localStorage.getItem(checkbox.id);
      if (savedState === 'true') {
        checkbox.checked = true;
      }
      
      // Save state when changed
      checkbox.addEventListener('change', function() {
        localStorage.setItem(this.id, this.checked);
      });
    });
  </script>
    `);
    setTimeout(handleNotifierCheckboxes, 50); // Small delay to allow DOM injection
};






// In your main JavaScript file
function handleNotifierCheckboxes() {
    // Load states
    document.querySelectorAll('.notifier-container input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
    });
    
    // Save on change
    document.querySelectorAll('.notifier-container input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        localStorage.setItem(this.id, this.checked);
      });
    });
  }
  