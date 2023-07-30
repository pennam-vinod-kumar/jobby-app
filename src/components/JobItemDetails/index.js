import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiTwotoneCamera} from 'react-icons/ai'
import {GrShare} from 'react-icons/gr'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
    id: data.id,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        jobDescription: fetchedData.job_details.job_description,
        id: fetchedData.job_details.id,
        skills: fetchedData.job_details.skills,
        lifeAtCompany: fetchedData.job_details.life_at_company,
        location: fetchedData.job_details.location,
        rating: fetchedData.job_details.rating,
        title: fetchedData.job_details.title,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
      }
      const updatedSimilarProductsData = fetchedData.similar_jobs.map(each =>
        this.getFormattedData(each),
      )
      console.log(updatedSimilarProductsData)
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      rating,
      title,
      packagePerAnnum,
    } = jobData

    const skillsList = skills.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    }))
    const lifeAtCompanyNew = {
      imageUrl: lifeAtCompany.image_url,
      description: lifeAtCompany.description,
    }

    return (
      <div className="product-details-success-view">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div>
            <h1>{title}</h1>
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p>{location}</p>
            <AiTwotoneCamera />
            <p>{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <div>
          <div>
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
            <GrShare />
          </div>
          <p>{jobDescription}</p>
        </div>
        <h1>Skills</h1>
        {skillsList.map(each => (
          <div key={each.name}>
            <img src={each.imageUrl} alt={each.name} />
            <h1>{each.name}</h1>
          </div>
        ))}
        <h1>Life at Company</h1>
        <div>
          <p>{lifeAtCompanyNew.description} </p>
          <img src={lifeAtCompanyNew.imageUrl} alt="life at company" />
        </div>

        <h1 className="similar-products-heading">Similar Jobs</h1>
        <ul className="similar-products-list">
          {similarJobsData.map(each => (
            <SimilarProductItem jobDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
