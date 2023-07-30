import './index.css'

const FiltersGroup = props => {
  const renderEmploymentFiltersList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(each => {
      const {changeEmploymentId} = props
      const onClickEmploymentItem = event =>
        changeEmploymentId(event.target.value)

      return (
        <li key={each.employmentTypeId}>
          <div>
            <input
              type="checkbox"
              value={each.employmentTypeId}
              onChange={onClickEmploymentItem}
              checked={employmentTypesList.includes(each.employmentTypeId)}
            />
            <label>{each.label}</label>
          </div>
        </li>
      )
    })
  }

  const renderEmploymentFilters = () => (
    <div>
      <h1 className="rating-heading">Type of Employment</h1>
      <ul className="ratings-list">{renderEmploymentFiltersList()}</ul>
    </div>
  )

  const renderSalaryList = () => {
    const {salaryRangesList, activeSalaryId} = props

    return salaryRangesList.map(each => {
      const {changeSalary} = props
      const onClickSalaryItem = event => changeSalary(event.target.value)

      return (
        <li key={each.salaryRangeId}>
          <div>
            <input
              type="radio"
              id={each.salaryRangeId}
              name="options"
              value={each.salaryRangeId}
              checked={activeSalaryId === each.salaryRangeId}
              onChange={onClickSalaryItem}
            />
            <label htmlFor={each.id}>{each.label}</label>
          </div>
        </li>
      )
    })
  }

  const renderSalariesFilter = () => (
    <>
      <h1 className="category-heading">Salary Range</h1>
      <ul className="categories-list">{renderSalaryList()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderEmploymentFilters()}
      {renderSalariesFilter()}
    </div>
  )
}

export default FiltersGroup
