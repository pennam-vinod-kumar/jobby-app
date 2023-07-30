import {AiTwotoneCamera} from 'react-icons/ai'
import './index.css'

const SimilarProductItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-product-item">
      <div className="logo-container">
        <img src={companyLogoUrl} alt="similar job company logo" />
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
      <h1>Description</h1>
      <p>{jobDescription}</p>
      <div>
        <p>{location}</p>
        <AiTwotoneCamera />
        <p>{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarProductItem
