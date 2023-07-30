import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants1 = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstants2 = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileDetails: {},
    apiStatus1: apiStatusConstants1.initial,
    apiStatus2: apiStatusConstants2.initial,
    activeEmploymentList: [],
    searchInput: '',
    activeSalaryId: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({
      apiStatus1: apiStatusConstants1.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
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
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatus1: apiStatusConstants1.success,
      })
    } else {
      this.setState({
        apiStatus1: apiStatusConstants1.failure,
      })
    }
  }

  renderLoadingView1 = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickRetry = () => {
    this.getProducts()
  }

  renderProfileFailureView = () => (
    <div className="profile-error-view-container">
      <button type="button" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-container">
        <img src={profileDetails.profileImageUrl} alt="profile" />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfileView = () => {
    const {apiStatus1} = this.state

    switch (apiStatus1) {
      case apiStatusConstants1.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants1.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants1.inProgress:
        return this.renderLoadingView1()
      default:
        return null
    }
  }

  getJobs = async () => {
    this.setState({
      apiStatus2: apiStatusConstants2.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentList, searchInput, activeSalaryId} = this.state
    const activeEmploymentIds = activeEmploymentList.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentIds}&minimum_package=${activeSalaryId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus2: apiStatusConstants2.success,
      })
    } else {
      this.setState({
        apiStatus2: apiStatusConstants2.failure,
      })
    }
  }

  renderLoadingView2 = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
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
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus2} = this.state

    switch (apiStatus2) {
      case apiStatusConstants2.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants2.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants2.inProgress:
        return this.renderLoadingView2()
      default:
        return null
    }
  }

  changeEmploymentId = activeEmploymentId => {
    this.setState(
      prevState => ({
        activeEmploymentList: prevState.activeEmploymentList.includes(
          activeEmploymentId,
        )
          ? prevState.activeEmploymentList.filter(
              item => item !== activeEmploymentId,
            )
          : [...prevState.activeEmploymentList, activeEmploymentId],
      }),
      this.getJobs,
    )
  }

  changeSalary = activeSalaryId => {
    this.setState({activeSalaryId}, this.getJobs)
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderSearchInput = () => {
    const {searchInput} = this.props

    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button type="button" data-testid="searchButton">
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {activeSalaryId} = this.state
    return (
      <div className="all-products-section">
        <ul>
          <li>
            <Header />
          </li>
          <li>{this.renderProfileView()}</li>
          <li>
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              activeSalaryId={activeSalaryId}
              changeSalary={this.changeSalary}
              changeEmploymentId={this.changeEmploymentId}
            />
          </li>
          <li>
            {this.renderSearchInput()}
            {this.renderAllJobs()}
          </li>
        </ul>
      </div>
    )
  }
}

export default Jobs
