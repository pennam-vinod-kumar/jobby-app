import {Link} from 'react-router-dom'
// import {FaLocationDot} from 'react-icons/fa'
import {AiTwotoneCamera} from 'react-icons/ai'

import './index.css'

const JobCard = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    id,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData

  return (
    <li className="product-item">
      <Link to={`/jobs/${id}`} className="link-item">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="company logo" />
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
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </Link>
    </li>
  )
}
export default JobCard
