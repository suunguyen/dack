package com.example.java_backend.models;
import javax.persistence.*;

@Entity
@Table(name = "sellers")
public class Seller {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String sellerId;
	
	private String businessCer;
	
	private Boolean isAccepted;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSellerId() {
		return sellerId;
	}

	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}

	public String getBusinessCer() {
		return businessCer;
	}

	public void setBusinessCer(String businessCer) {
		this.businessCer = businessCer;
	}

	public Boolean getIsAccepted() {
		return isAccepted;
	}

	public void setIsAccepted(Boolean isAccepted) {
		this.isAccepted = isAccepted;
	}

	public Seller(String sellerId, String businessCer) {
		super();
		this.sellerId = sellerId;
		this.businessCer = businessCer;
	}
}