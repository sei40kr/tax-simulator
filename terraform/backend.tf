terraform {
  backend "s3" {
    bucket       = "tax-simulator.yong-ju.me-tfstate"
    key          = "terraform.tfstate"
    region       = "ap-northeast-1"
    encrypt      = true
    use_lockfile = true
  }
}
