$(document).ready(function () {
  // function to save the data to local storage

  function saveDTL(data) {
    localStorage.setItem("mykey", JSON.stringify(data));
  }

  // function to get the data from local storage

  function getDFL() {
    const data = JSON.parse(localStorage.getItem("mykey")) || [];
    return data;
  }

  // if local storgae is empty only then ajaxcall should happen

  const check = getDFL();
  if (check == "" || check == null) {
    ajaxCall();
  } else {
    generateCards(check);
  }

  // ajaxcall function

  function ajaxCall() {
    $.ajax({
      url: "data.json",
      success: function (data) {
        localStorage.setItem("mykey", JSON.stringify(data));
      },
      error: function (error) {
        alert("Error fetching data: ", error);
      },
    });
  }

  // generating the cards dynamically

  function generateCards(data) {
    let cards = "";
    data.forEach((product) => {
      cards += `
            <div class="card m-3" style="width: 18rem;">
                <img src="${product.image}" class="card-img-top image" alt="...">
                <div class="card-body">
                    <h5 class="card-title pname">${product.name}</h5>
                    <p class="card-text pprice">${product.price}</p>
                    <p class="card-text pdesc">${product.description}</p>
                    <a href="details.htm" type="button" class="btn btn-primary buynow" id="buynow">Buy Now</a>
                </div>
            </div>
            `;
    });
    $(".card-cont").append(cards);
  }

  // empty the form feilds before the user clicks add button

  const imgUrl = $("#imgurl").val("");
  const pName = $("#pname").val("");
  const pPrice = $("#pprice").val("");
  const pDesc = $("#pdesc").val("");

  //   inside the moadal addproduct button to save the data entered by user in local storage and then then display the newly added data with previous one

  $("#addproductbtn").click(function () {
    if ($("#modalform").valid()) {
      const imgUrl = $("#imgurl").val();
      const pName = $("#pname").val();
      const pPrice = $("#pprice").val();
      const pDesc = $("#pdesc").val();

      let data = getDFL();

      let updatedPdata = {
        name: pName,
        price: pPrice,
        image: imgUrl,
        description: pDesc,
      };
      data.push(updatedPdata);
      saveDTL(data);
      generateCards(data);
      location.reload();
      $("#myModal").modal("hide");
    }
    else {
        $("#myModal").modal("show");
    }
  });

  // buynow button opening details page

  $(document).on("click", ".buynow", function () {
    const clickedCard = $(this).closest(".card");
    const newImg = clickedCard.find(".image").attr("src");
    const newName = clickedCard.find(".pname").text();
    const newPrice = clickedCard.find(".pprice").text();
    const newDesc = clickedCard.find(".pdesc").text();

    let cardData = {
      name: newName,
      price: newPrice,
      image: newImg,
      description: newDesc,
    };
    localStorage.setItem("selectedCard", JSON.stringify(cardData));
    // Redirect to the details.htm page
    window.location.href = "details.htm";
  });

  //   getting the specific card data
  const storedData = JSON.parse(localStorage.getItem("selectedCard"));

  // Display the data on the page details.htm

  let card = "";
  if (storedData) {
    card += `
      <div class="card m-3" style="width: 18rem;">
        <img src="${storedData.image}" class="card-img-top image" alt="...">
        <div class="card-body">
          <h5 class="card-title pname">${storedData.name}</h5>
          <p class="card-text pprice">${storedData.price}</p>
          <p class="card-text pdesc">${storedData.description}</p>
          <button type="button" id="addtocartbtn" class="btn btn-warning addtocart">Add To Cart</button>
           <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header d-flex justify-content-end">
                        <small style="color:black">Just Now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Item added to cart Successfully!
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    //   toast javascript bootstrap

    const toastTrigger = document.getElementById("addtocartbtn");
    const toastLiveExample = document.getElementById("liveToast");
  
    if (toastTrigger) {
      const toastBootstrap =
        bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastTrigger.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }
    </script>
    `;
    $("#product-details").html(card);
  }

  $(document).on("click", ".addtocart", function () {
    const clickedCard = $(this).closest(".card");
    const newImg = clickedCard.find(".image").attr("src");
    const newName = clickedCard.find(".pname").text().trim();
    const newPrice = clickedCard.find(".pprice").text().trim();
    const newDesc = clickedCard.find(".pdesc").text().trim();

    console.log(newDesc);
    let selectedCards = JSON.parse(localStorage.getItem("selectedCards")) || [];

    let cardData = {
      name: newName,
      price: newPrice,
      image: newImg,
      description: newDesc,
    };
    selectedCards.push(cardData);

    // Store the updated array in localStorage
    localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
  });

  const cartData = JSON.parse(localStorage.getItem("selectedCards"));
  let cartItems = "";

  $(document).on("click", "#cartbtn", function () {
    window.location.href = "cart.htm";
  });

//   adding the id to cartData items so that we can fetch quantity wrt id 

  for (let i = 0; i < cartData.length; i++) {
    cartData[i].id = i + 1;
  }

  cartData.forEach((item) => {
    const quantityInputId = `quantity_${item.id}`;
    cartItems += `
      <div class="card m-3" style="width: 18rem;">
          <img src="${item.image}" class="card-img-top image" alt="...">
          <div class="card-body">
              <h5 class="card-title pname">${item.name}</h5>
              <p class="card-text pprice">${item.price} * <span class="quan-items"></span> = <span class="tot-price"></span></p>
              <p class="card-text pdesc">${item.description}</p>
                <div class="quantity-cont d-flex align-items-center">
                    <input type="number" min="1" max="10" class="form-control-sm quantity m-2" id="${quantityInputId}"
                    placeholder="1" required>
                </div>
          </div>
      </div>
      `;

    $(".cart-container").html(cartItems);

    // Access the input element by its ID and add an event listener to log the quantity whenever it changes
    
    $(".cart-container").on("input", ".quantity", function () {
      const quantityInput = $(this);
      const itemIndex = parseInt(quantityInput.attr("id").split("_")[1], 10);
      const quantity = parseInt(quantityInput.val());
      $(this).parent().siblings('.pprice').children('.quan-items').html(`${quantity}`);
      let price = parseInt($(this).parent().siblings('.pprice').html());
      console.log(quantity)
      let prodTotalPrice= price * quantity;
      $(this).parent().siblings('.pprice').children('.tot-price').html(`${prodTotalPrice}`);
      let prevPrice = parseInt($(this).parent().siblings('.pprice').children('.tot-price').html());
      show();
    //   console.log(prevPrice)
    // console.log(prodTotalPrice)
    
    //     console.log(totalPrice);
        // console.log(price);
        // console.log(quantity);

       
});
function show(){
    let totalPrice = 0;
    let ele = $(".tot-price");

    for(let i=0;i<ele.length;i++){
        
        console.log(ele[i].innerHTML)
        totalPrice += Number(ele[i].innerHTML);
        console.log(totalPrice)
    }
      
    let tp = `
    <h5 class="mx-2">Total Price :${totalPrice}</h5>`
    $("#total").html(tp);}
    });
    

//   checkout toast message js
  const toastTrigg = document.getElementById("liveToastBtn");
  const toastLiveExamp = document.getElementById("liveToast");

  if (toastTrigg) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExamp);
    toastTrigg.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }

//   addbtn modal form validation 

  $("#modalform").validate({
    rules: {
      pname: "required",
      imgurl: "required",
      pprice: "required",
      pdesc: "required",
    },
    messages: {
      pname: "Please enter product name",
      imgurl: "Please enter image url",
      pprice: "Please enter product price",
      pdesc: "Please enter product description",
    },
  });
});
