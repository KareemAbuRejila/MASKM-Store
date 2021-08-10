package edu.miu.waa.maskmstore.domain;


import edu.miu.waa.maskmstore.domain.stock.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotEmpty
    private double stars;

    @NotEmpty
    @NotBlank
    private String comment;

    @ManyToOne
    private Product product;
}
