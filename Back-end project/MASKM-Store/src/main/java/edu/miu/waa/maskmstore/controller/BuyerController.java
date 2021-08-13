package edu.miu.waa.maskmstore.controller;

import edu.miu.waa.maskmstore.domain.Buyer;
import edu.miu.waa.maskmstore.domain.Order;
import edu.miu.waa.maskmstore.domain.OrderStatus;
import edu.miu.waa.maskmstore.domain.Seller;
import edu.miu.waa.maskmstore.service.BuyerService;
import edu.miu.waa.maskmstore.service.OrderService;
import edu.miu.waa.maskmstore.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/buyer")
public class BuyerController {

    @Autowired
    BuyerService buyerService;
    @Autowired
    SellerService sellerService;
    @Autowired
    OrderService orderService;

    @PostMapping
    public void addBuyer(@RequestBody Buyer buyer){

        buyerService.addBuyer(buyer);
    }

    @PostMapping("/profile/{userName}/edit")
    public void ediBuyer(@RequestBody Buyer buyer,String userName){
        //Buyer buyer =new Buyer();
        buyerService.getBuyerByUsername(userName);
        buyerService.addBuyer(buyer);
    }
    @GetMapping
    public List<Buyer> getAllBuyer(){
        return buyerService.getAllBuyers();
    }
    @GetMapping("/pagination")
    public List<Buyer> getAllBuyersPaging(@RequestParam("page")int pageNumber){
        return buyerService.getAllBuyerWithPagingAndSorting(PageRequest.of(pageNumber,1));
    }

    @GetMapping("/{id}")
    public Buyer getBuyerById(@PathVariable("id") long id){
        return buyerService.getBuyerBybId(id);
    }
    @GetMapping("/profile/{userName}")
    public Buyer getBuyerByUserName(@PathVariable String userName){
        return buyerService.getBuyerByUsername(userName);
    }
    @GetMapping("/{userName}/follow")
    public List<Seller> getAllSellerFollowedByBuyer(@PathVariable String userName){
        return buyerService.getBuyerByUsername(userName).getSellersFollowed();
    }

    @PostMapping("/{bUserName}/follow/{sUserName}")
    public void followSeller(@PathVariable String bUserName, @PathVariable String sUserName){
         buyerService.followSeller(
                buyerService.getBuyerByUsername(bUserName).getBId(),
                sellerService.getSellerByUserName(sUserName).getSId()
        );
    }

        @PostMapping("/{bUserName}/unfollow/{sUserName}")
        public void unFollowSeller(@PathVariable String bUserName, @PathVariable String sUserName){
            buyerService.unFollowSeller(
                    buyerService.getBuyerByUsername(bUserName).getBId(),
                    sellerService.getSellerByUserName(sUserName).getSId()
            );
    }
    @PostMapping("/{userName}/order/delivered/{id}")
    public Order deliveredOrder(@PathVariable("userName") String userName,@PathVariable("id") long oId){
        Buyer buyer =buyerService.getBuyerByUsername(userName);
        List<Long> lOID= buyerService.getBuyerByUsername(userName).getOrders().stream().map(o->o.getId()).collect(Collectors.toList());
        if( lOID.contains(oId)) {
            Order order=orderService.getOrderById(oId);
            order.setOrderStatus(OrderStatus.Delivered);
            orderService.save(order);
            buyerService.save(buyer);
            return order;
        }
        return null;
    }

    @PostMapping("/{userName}/order/returned/{id}")
    public Order returndOrder(@PathVariable("userName") String userName,@PathVariable("id") long oId){
        Buyer buyer =buyerService.getBuyerByUsername(userName);
        List<Long> lOID= buyerService.getBuyerByUsername(userName).getOrders().stream().map(o->o.getId()).collect(Collectors.toList());
        Order order=orderService.getOrderById(oId);
        if( lOID.contains(oId) && order.getOrderStatus()!=OrderStatus.Returned) {

            order.setOrderStatus(OrderStatus.Returned);
            buyer.setPoints((int) (buyer.getPoints() - order.getPrice()));
            orderService.save(order);
            buyerService.save(buyer);
            return order;
        }
        return null;
    }

    @PostMapping("/{userName}/order")
    public void addOrder(@RequestBody Order order, @PathVariable String userName){
           Buyer buyer =buyerService.getBuyerByUsername(userName);
           if (buyer.getCreditCard()!=null)
           {
           buyer.setPoints((int) order.getPrice());
           buyerService.addOrder(userName, order);
           order.setOrderPaid(true);
           buyerService.save(buyer);
           }
    }

    @GetMapping("/{userName}/order/{id}")
    public Order getOrderByBuyerUserNameOrderId(@PathVariable long id, @PathVariable String userName){

       return buyerService.getOrderByBuyerUserNameOrderId(id, userName);
    }

    @GetMapping("/{userName}/orders")
    public List<Order> getAllOrdersForBuyer(@PathVariable String userName){

        return buyerService.getAllOrdersForBuyer(buyerService.getBuyerByUsername(userName).getBId());
    }

    @GetMapping("/profile/{userName}")
    public Buyer getBuyerById(@PathVariable String userName){
        return buyerService.getBuyerByUsername(userName);
    }


    @GetMapping("/{id}/orders")
    public List<Order> getAllOrdersForBuyer(@PathVariable long id){
        return buyerService.getAllOrdersForBuyer(id);
    }

}
